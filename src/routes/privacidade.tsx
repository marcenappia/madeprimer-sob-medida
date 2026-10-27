import { createFileRoute } from "@tanstack/react-router";
import { PageHero, seo } from "@/components/site/ui";

export const Route = createFileRoute("/privacidade")({
  head: () => seo("Política de privacidade — MadePrimer", "Como a MadePrimer trata os dados enviados pelo site."),
  component: () => (
    <>
      <PageHero eyebrow="Privacidade" title="Política de privacidade" />
      <section className="container-site max-w-3xl space-y-5 pb-24 leading-relaxed text-muted-foreground">
        <p className="border-l-2 border-wood pl-4 text-sm">Texto provisório. A versão final deve ser revisada juridicamente (LGPD) antes da publicação.</p>
        <p>Nesta versão de demonstração, os dados preenchidos no formulário de orçamento não são enviados a servidores ou serviços externos.</p>
        <p>Na versão final, nome, telefone, e-mail e informações do projeto serão usados exclusivamente para responder à sua solicitação de orçamento.</p>
      </section>
    </>
  ),
});
