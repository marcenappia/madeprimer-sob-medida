import { Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { demoLeadRepository, type QuoteLead } from "@/lib/leads";
import { btn } from "./ui";
import { cn } from "@/lib/utils";

const AMBIENTES = ["Cozinha", "Dormitório", "Closet", "Sala / Home", "Banheiro", "Escritório", "Loja / Comercial", "Recepção", "Outro"];
const PRAZOS = ["Até 1 mês", "1 a 3 meses", "3 a 6 meses", "Sem pressa definida"];
const FAIXAS = ["Até R$ 15 mil", "R$ 15 a 40 mil", "R$ 40 a 80 mil", "Acima de R$ 80 mil", "Prefiro não informar"];
const MAX_FILES = 6;
const MAX_SIZE = 10 * 1024 * 1024;

type Files = { file: File; name: string; size: number }[];
const empty = { ambiente: "", objetivo: "", cidade: "", medidas: "", prazo: "", investimento: "", nome: "", telefone: "", email: "", aceitePrivacidade: false };
type Data = typeof empty;
type Errors = Partial<Record<keyof Data | "files", string>>;

export function validateStep(step: number, d: Data): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.ambiente) e.ambiente = "Selecione o ambiente.";
    if (d.objetivo.trim().length < 10) e.objetivo = "Descreva o objetivo em pelo menos 10 caracteres.";
    if (d.objetivo.length > 1000) e.objetivo = "Máximo de 1000 caracteres.";
    if (d.cidade.trim().length < 2) e.cidade = "Informe a cidade.";
  }
  if (step === 1) {
    if (d.medidas.length > 300) e.medidas = "Máximo de 300 caracteres.";
    if (!d.prazo) e.prazo = "Selecione o prazo desejado.";
    if (!d.investimento) e.investimento = "Selecione uma faixa.";
  }
  if (step === 2) {
    if (d.nome.trim().length < 2) e.nome = "Informe seu nome.";
    const digits = d.telefone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) e.telefone = "Informe um telefone válido com DDD.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Informe um e-mail válido.";
    if (!d.aceitePrivacidade) e.aceitePrivacidade = "É necessário aceitar a política de privacidade.";
  }
  return e;
}

const fieldCls = (err?: string) =>
  cn("w-full rounded-sm border bg-card px-4 py-3.5 text-base outline-none transition-colors focus:border-wood", err ? "border-destructive" : "border-input");

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string | undefined; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
      {error ? <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-destructive">{error}</p> : hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>(empty);
  const [files, setFiles] = useState<Files>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [protocol, setProtocol] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const aria = (k: keyof Data) => ({ id: k, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    let err: string | undefined;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!/^image\/|application\/pdf/.test(f.type)) { err = "Envie apenas imagens ou PDF."; continue; }
      if (f.size > MAX_SIZE) { err = `"${f.name}" excede 10 MB.`; continue; }
      if (next.length >= MAX_FILES) { err = `Máximo de ${MAX_FILES} arquivos.`; break; }
      next.push({ file: f, name: f.name, size: f.size });
    }
    setFiles(next);
    setErrors((p) => ({ ...p, files: err }));
  };

  const go = (to: number) => {
    setStep(to);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => {
    const e = validateStep(step, d);
    setErrors(e);
    if (Object.keys(e).length === 0) go(step + 1);
  };
  const submit = async () => {
    const e = validateStep(2, d);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    const lead: QuoteLead = { ...d, referencias: files.map(({ name, size }) => ({ name, size })) };
    const res = await demoLeadRepository.submit(lead);
    setProtocol(res.id);
    setStatus("done");
    go(3);
  };

  if (status === "done") {
    return (
      <div ref={topRef} className="border bg-card p-8 md:p-12" role="status">
        <p className="eyebrow">Demonstração</p>
        <h2 className="mt-4 text-4xl">Obrigado, {d.nome.split(" ")[0]}.</h2>
        <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
          Este é um protótipo: <strong className="text-foreground">nenhum dado foi enviado</strong> a servidores ou serviços externos. Na versão final, sua solicitação será recebida pela equipe MadePrimer.
        </p>
        <p className="mt-6 text-sm">Protocolo de demonstração: <span className="font-mono">{protocol}</span></p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className={btn("outline")} onClick={() => { setD(empty); setFiles([]); setStatus("idle"); setStep(0); }}>Nova solicitação</button>
          <Link to="/" className={btn("ghost")}>Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const labels = ["Projeto", "Detalhes", "Contato"];
  return (
    <div ref={topRef} className="scroll-mt-24">
      <ol className="mb-10 grid grid-cols-3 gap-2" aria-label="Etapas">
        {labels.map((l, i) => (
          <li key={l} aria-current={i === step ? "step" : undefined}>
            <div className={cn("h-0.5 transition-colors", i <= step ? "bg-forest" : "bg-border")} />
            <p className={cn("mt-3 text-xs font-semibold uppercase tracking-widest", i === step ? "text-foreground" : "text-muted-foreground")}>
              <span className="mr-1 font-display text-sm normal-case italic text-wood">0{i + 1}</span> {l}
            </p>
          </li>
        ))}
      </ol>

      <div className="space-y-6 border bg-card/60 p-5 md:p-10">
        {step === 0 && (
          <>
            <Field id="ambiente" label="Ambiente / projeto" error={errors.ambiente}>
              <select {...aria("ambiente")} className={fieldCls(errors.ambiente)} value={d.ambiente} onChange={(e) => set("ambiente", e.target.value)}>
                <option value="">Selecione…</option>
                {AMBIENTES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field id="objetivo" label="Objetivo" error={errors.objetivo} hint="Conte o que você espera do ambiente.">
              <textarea {...aria("objetivo")} rows={5} maxLength={1000} className={fieldCls(errors.objetivo)} value={d.objetivo} onChange={(e) => set("objetivo", e.target.value)} />
            </Field>
            <Field id="cidade" label="Cidade" error={errors.cidade}>
              <input {...aria("cidade")} autoComplete="address-level2" maxLength={80} className={fieldCls(errors.cidade)} value={d.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field id="medidas" label="Medidas aproximadas (opcional)" error={errors.medidas} hint="Ex.: parede de 3,20 m × 2,70 m de altura.">
              <input {...aria("medidas")} maxLength={300} className={fieldCls(errors.medidas)} value={d.medidas} onChange={(e) => set("medidas", e.target.value)} />
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <Field id="prazo" label="Prazo desejado" error={errors.prazo}>
                <select {...aria("prazo")} className={fieldCls(errors.prazo)} value={d.prazo} onChange={(e) => set("prazo", e.target.value)}>
                  <option value="">Selecione…</option>
                  {PRAZOS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field id="investimento" label="Faixa de investimento" error={errors.investimento}>
                <select {...aria("investimento")} className={fieldCls(errors.investimento)} value={d.investimento} onChange={(e) => set("investimento", e.target.value)}>
                  <option value="">Selecione…</option>
                  {FAIXAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Referências e fotos (opcional)</p>
              <div
                role="button"
                tabIndex={0}
                aria-label="Adicionar arquivos de referência"
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                className={cn("flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors", drag ? "border-wood bg-secondary" : "border-input bg-card hover:border-wood")}
              >
                <p className="font-display text-xl">Arraste arquivos aqui</p>
                <p className="mt-1 text-sm text-muted-foreground">ou toque para selecionar · imagens ou PDF · até 10 MB · máx. {MAX_FILES}</p>
              </div>
              <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
              {errors.files && <p role="alert" className="mt-2 text-sm text-destructive">{errors.files}</p>}
              {files.length > 0 && (
                <ul className="mt-4 divide-y border bg-card">
                  {files.map((f, i) => (
                    <li key={f.name + i} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="truncate">{f.name} <span className="text-muted-foreground">· {(f.size / 1024 / 1024).toFixed(1)} MB</span></span>
                      <button type="button" className="text-muted-foreground hover:text-destructive" aria-label={`Remover ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}>Remover</button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-muted-foreground">Nesta demonstração os arquivos não são enviados.</p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Field id="nome" label="Nome" error={errors.nome}>
              <input {...aria("nome")} autoComplete="name" maxLength={100} className={fieldCls(errors.nome)} value={d.nome} onChange={(e) => set("nome", e.target.value)} />
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <Field id="telefone" label="WhatsApp / telefone" error={errors.telefone}>
                <input {...aria("telefone")} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="(00) 00000-0000" className={fieldCls(errors.telefone)} value={d.telefone} onChange={(e) => set("telefone", e.target.value)} />
              </Field>
              <Field id="email" label="E-mail" error={errors.email}>
                <input {...aria("email")} type="email" autoComplete="email" maxLength={255} className={fieldCls(errors.email)} value={d.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </div>

            <div className="border-t pt-6">
              <p className="eyebrow">Revisão</p>
              <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ["Ambiente", d.ambiente], ["Cidade", d.cidade], ["Prazo", d.prazo], ["Investimento", d.investimento],
                  ["Medidas", d.medidas || "—"], ["Arquivos", files.length ? `${files.length} anexado(s)` : "Nenhum"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>
                ))}
                <div className="sm:col-span-2"><dt className="text-muted-foreground">Objetivo</dt><dd className="mt-1 whitespace-pre-line">{d.objetivo}</dd></div>
              </dl>
              <div className="mt-4 flex gap-4 text-sm">
                <button type="button" className="underline underline-offset-4" onClick={() => go(0)}>Editar projeto</button>
                <button type="button" className="underline underline-offset-4" onClick={() => go(1)}>Editar detalhes</button>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm">
                <input id="aceitePrivacidade" type="checkbox" className="mt-0.5 h-5 w-5 accent-forest" checked={d.aceitePrivacidade} aria-invalid={!!errors.aceitePrivacidade} onChange={(e) => set("aceitePrivacidade", e.target.checked)} />
                <span>Li e aceito a <Link to="/privacidade" className="underline underline-offset-4" target="_blank">política de privacidade</Link>.</span>
              </label>
              {errors.aceitePrivacidade && <p role="alert" className="mt-2 text-sm text-destructive">{errors.aceitePrivacidade}</p>}
            </div>
          </>
        )}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? <button type="button" className={btn("outline")} onClick={() => go(step - 1)}>← Voltar</button> : <span />}
          {step < 2 ? (
            <button type="button" className={btn("primary")} onClick={next}>Continuar →</button>
          ) : (
            <button type="button" className={btn("primary")} disabled={status === "sending"} onClick={submit}>
              {status === "sending" ? "Enviando…" : "Enviar solicitação"}
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Protótipo: os dados ficam apenas no seu navegador e não são enviados.</p>
    </div>
  );
}
