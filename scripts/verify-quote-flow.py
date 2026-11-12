"""Verificação automatizada do formulário de orçamento (/orcamento).

Percorre as 3 etapas em celular e computador, confere as validações e o envio
final. Nenhum dado sai do navegador: o envio (tRPC submitQuote) e o upload de
anexos são respondidos localmente por interceptação, e qualquer requisição para
fora do servidor local é bloqueada e faz a verificação falhar.

Uso:  python3 scripts/verify-quote-flow.py [URL_BASE]
      (padrão: http://localhost:8080)
"""

import asyncio
import json
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import Page, Route, async_playwright, expect

BASE_URL = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")
LOCAL_HOST = urlparse(BASE_URL).hostname
SCREENSHOTS = Path(tempfile.gettempdir()) / "madeprimer-quote-check"
VIEWPORTS = {
    "celular": {"width": 390, "height": 844},
    "computador": {"width": 1280, "height": 1800},
}
# PNG 1x1 usado como anexo de referência.
PNG_BYTES = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082"
)
FAKE_REFERENCE = "MP-TESTE-0001"


async def expect_blocked(page: Page, label: str, message: str) -> None:
    """O envio deve ser barrado: pela mensagem do formulário ou pela validação nativa do campo."""
    field = page.get_by_label(label)
    natively_invalid = await field.evaluate("el => !el.validity.valid")
    if not natively_invalid:
        await expect(page.get_by_role("alert")).to_contain_text(message)
    await expect(page.get_by_role("status")).to_have_count(0)


async def run_viewport(browser, name: str, viewport: dict, attachment: Path) -> None:
    context = await browser.new_context(viewport=viewport, is_mobile=name == "celular")
    page = await context.new_page()
    submitted: list[dict] = []
    uploads: list[str] = []
    blocked: list[str] = []
    page_errors: list[str] = []
    page.on("pageerror", lambda exc: page_errors.append(str(exc)))

    async def guard(route: Route) -> None:
        url = route.request.url
        host = urlparse(url).hostname
        if url.startswith("data:") or url.startswith("blob:"):
            return await route.continue_()
        if host != LOCAL_HOST:
            blocked.append(url)
            return await route.abort()
        if "/api/trpc/" in url and "site.submitQuote" in url:
            body = route.request.post_data_json or {}
            submitted.append(body)
            payload = [{"result": {"data": {"json": {"quoteId": 1, "reference": FAKE_REFERENCE, "uploadToken": "ticket-teste"}}}}]
            return await route.fulfill(status=200, content_type="application/json", body=json.dumps(payload))
        if "/api/quotes/" in url and route.request.method == "PUT":
            uploads.append(url)
            return await route.fulfill(status=200, content_type="application/json", body="{}")
        return await route.continue_()

    await page.route("**/*", guard)
    await page.goto(f"{BASE_URL}/orcamento", wait_until="networkidle")
    await expect(page.get_by_role("heading", name="Solicitar orçamento")).to_be_visible()
    await page.screenshot(path=str(SCREENSHOTS / f"{name}-1-inicio.png"))

    alert = page.get_by_role("alert")
    next_btn = page.get_by_role("button", name="CONTINUAR")

    current_step = page.locator(".mp-form-progress [aria-current=step]")
    await expect(current_step).to_contain_text("Projeto")

    # Etapa 1: tentar avançar vazio deve mostrar erro.
    await next_btn.click()
    await expect(alert).to_contain_text("Informe o ambiente")
    await page.get_by_label("Ambiente").select_option("Cozinha")
    await page.get_by_label("Objetivo do projeto").fill("Cozinha com ilha e armários até o teto")
    await page.get_by_label("Cidade").fill("Cidade Teste")
    await next_btn.click()
    await expect(alert).to_have_count(0)

    # Etapa 2: campos opcionais + anexo.
    await expect(current_step).to_contain_text("Detalhes")
    await expect(page.get_by_label("Medidas aproximadas")).to_be_visible()
    await page.get_by_label("Medidas aproximadas").fill("3 m × 2,4 m")
    await page.get_by_label("Prazo desejado").fill("Próximos 3 meses")
    await page.get_by_label("Faixa de investimento").select_option("R$ 25 mil a R$ 50 mil")
    await page.get_by_label("Detalhes adicionais").fill("Mensagem de verificação automatizada.")
    await page.locator("input[type=file]").set_input_files(str(attachment))
    await expect(page.locator(".mp-file-list li")).to_have_count(1)
    await page.screenshot(path=str(SCREENSHOTS / f"{name}-2-medidas.png"))
    await next_btn.click()

    # Etapa 3: validações de contato.
    await expect(current_step).to_contain_text("Contato")
    font_size = await page.get_by_label("Nome").evaluate("el => parseFloat(getComputedStyle(el).fontSize)")
    if name == "celular":
        assert font_size >= 16, f"[celular] campos com {font_size}px fazem o iPhone dar zoom"
    submit_btn = page.get_by_role("button", name="REVISAR E ENVIAR")
    await expect(submit_btn).to_be_visible()
    await submit_btn.click()
    await expect_blocked(page, "Nome", "Informe seu nome")
    await page.get_by_label("Nome").fill("Pessoa Teste")
    await page.get_by_label("Telefone / WhatsApp").fill("abc")
    await page.get_by_label("E-mail").fill("pessoa@exemplo.com")
    await submit_btn.click()
    await expect(alert).to_contain_text("telefone válido")
    await page.get_by_label("Telefone / WhatsApp").fill("(11) 90000-0000")
    await page.get_by_label("E-mail").fill("email-invalido")
    await submit_btn.click()
    await expect_blocked(page, "E-mail", "e-mail válido")
    await page.get_by_label("E-mail").fill("pessoa@exemplo.com")
    await submit_btn.click()
    await expect(alert).to_contain_text("política de privacidade")
    await page.get_by_role("checkbox").check()

    # Revisão deve refletir o que foi preenchido.
    await expect(page.get_by_text("Cozinha · Cozinha com ilha")).to_be_visible()
    await expect(page.get_by_text("R$ 25 mil a R$ 50 mil")).to_be_visible()
    await page.screenshot(path=str(SCREENSHOTS / f"{name}-3-contato.png"))

    # Voltar preserva dados.
    await page.get_by_role("button", name="VOLTAR").click()
    await expect(page.get_by_label("Medidas aproximadas")).to_have_value("3 m × 2,4 m")
    await next_btn.click()
    await expect(page.get_by_label("Nome")).to_have_value("Pessoa Teste")

    await submit_btn.click()
    await expect(page.get_by_role("status")).to_contain_text(FAKE_REFERENCE)
    await page.screenshot(path=str(SCREENSHOTS / f"{name}-4-confirmacao.png"))

    overflow = await page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    await context.close()

    assert len(submitted) == 1, f"[{name}] esperado 1 envio interceptado, recebido {len(submitted)}"
    sent = json.dumps(submitted[0], ensure_ascii=False)
    assert "pessoa@exemplo.com" in sent and "Cidade Teste" in sent, f"[{name}] dados enviados incompletos: {sent}"
    assert len(uploads) == 1, f"[{name}] esperado 1 anexo interceptado, recebido {len(uploads)}"
    assert not blocked, f"[{name}] tentativa de acesso externo bloqueada: {blocked}"
    assert not page_errors, f"[{name}] erros de JavaScript: {page_errors}"
    assert not overflow, f"[{name}] página com rolagem horizontal"
    print(f"OK  {name} ({viewport['width']}x{viewport['height']}): 3 etapas, validações e confirmação")


async def main() -> None:
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    attachment = SCREENSHOTS / "referencia-teste.png"
    attachment.write_bytes(PNG_BYTES)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            for name, viewport in VIEWPORTS.items():
                await run_viewport(browser, name, viewport, attachment)
        finally:
            await browser.close()
    print(f"Capturas de tela em {SCREENSHOTS}")


if __name__ == "__main__":
    asyncio.run(main())
