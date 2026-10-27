import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type FormValues = {
  projectType: string;
  objective: string;
  city: string;
  measurements: string;
  desiredTimeline: string;
  budgetRange: string;
  message: string;
  fullName: string;
  phone: string;
  email: string;
  privacyAccepted: boolean;
};
const emptyForm: FormValues = {
  projectType: "", objective: "", city: "", measurements: "", desiredTimeline: "", budgetRange: "", message: "", fullName: "", phone: "", email: "", privacyAccepted: false,
};
const MAX_FILES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ reference: string; attachmentWarning: string } | null>(null);
  const submitMutation = trpc.site.submitQuote.useMutation();

  const setField = (key: keyof FormValues, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const chooseFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.currentTarget.files ?? []);
    if (selected.length > MAX_FILES) { setError("Escolha no máximo seis arquivos."); event.currentTarget.value = ""; return; }
    if (selected.some((file) => file.size > MAX_FILE_SIZE)) { setError("Cada arquivo deve ter no máximo 10 MB."); event.currentTarget.value = ""; return; }
    if (selected.some((file) => !ACCEPTED_TYPES.has(file.type))) { setError("Use somente JPG, PNG, WebP ou PDF."); event.currentTarget.value = ""; return; }
    setFiles(selected);
    setError("");
  };
  const validateCurrentStep = () => {
    if (step === 1 && (!form.projectType || form.objective.trim().length < 2 || form.city.trim().length < 2)) return "Informe o ambiente, o objetivo do projeto e a cidade.";
    if (step === 3) {
      if (form.fullName.trim().length < 2) return "Informe seu nome.";
      if (!/^[+\d().\s-]{8,40}$/.test(form.phone.trim())) return "Informe um telefone válido.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Informe um e-mail válido.";
      if (!form.privacyAccepted) return "É necessário aceitar a política de privacidade para enviar a solicitação.";
    }
    return "";
  };
  const next = () => {
    const message = validateCurrentStep();
    if (message) { setError(message); return; }
    setError("");
    setStep((current) => Math.min(3, current + 1));
  };
  const previous = () => { setError(""); setStep((current) => Math.max(1, current - 1)); };

  const uploadFiles = async (quoteId: number, token: string | null) => {
    if (!files.length) return "";
    if (!token) return "A solicitação foi registrada, mas não foi possível preparar os anexos.";
    const failures: string[] = [];
    for (const file of files) {
      try {
        const response = await fetch(`/api/quotes/${quoteId}/attachments`, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "X-Upload-Ticket": token,
            "X-File-Name": encodeURIComponent(file.name),
          },
          body: file,
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          failures.push(`${file.name}: ${body.error || "falha no envio"}`);
        }
      } catch {
        failures.push(`${file.name}: falha de conexão`);
      }
    }
    return failures.length ? `A solicitação foi registrada, mas alguns anexos não foram enviados: ${failures.join("; ")}` : "";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const message = validateCurrentStep();
    if (message) { setError(message); return; }
    setError("");
    try {
      const saved = await submitMutation.mutateAsync({
        ...form,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        privacyAccepted: true,
        attachmentCount: files.length,
      });
      const attachmentWarning = await uploadFiles(saved.quoteId, saved.uploadToken);
      setResult({ reference: saved.reference, attachmentWarning });
    } catch {
      setError("Não foi possível registrar a solicitação agora. Confira sua conexão e tente novamente.");
    }
  };

  return <section className="mp-form-page">
    <header className="mp-section-intro"><p className="mp-eyebrow">MADEPRIMER · PLANEJADOS DE INTERIORES</p><h1>Solicitar orçamento</h1><p className="mp-lead">Conte um pouco sobre o seu projeto.</p></header>
    <div className="mp-form-card">
      {result ? <div className="mp-form-success" role="status"><p className="mp-eyebrow">SOLICITAÇÃO REGISTRADA</p><h2>Obrigado por conversar com a MadePrimer.</h2><p>Recebemos as informações do seu projeto.</p><p className="mp-reference">Referência: {result.reference}</p>{result.attachmentWarning && <p className="mp-form-error">{result.attachmentWarning}</p>}<Link className="mp-button" href="/">VOLTAR AO INÍCIO</Link></div> : <>
        <div className="mp-form-progress" aria-label={`Etapa ${step} de 3`}>{[1, 2, 3].map((number) => <span key={number} className={number === step ? "is-active" : number < step ? "is-done" : ""}>{number}</span>)}<i /><span className="mp-field-hint">ETAPA {step} DE 3</span></div>
        <form onSubmit={handleSubmit}>
          {step === 1 && <div className="mp-form-grid">
            <label className="mp-field"><span>Ambiente</span><select required value={form.projectType} onChange={(event) => setField("projectType", event.target.value)}><option value="">Selecione</option>{["Cozinha", "Dormitório", "Sala / living", "Área gourmet", "Corporativo", "Projeto especial", "Outro"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="mp-field"><span>Objetivo do projeto</span><input required maxLength={500} value={form.objective} onChange={(event) => setField("objective", event.target.value)} placeholder="O que você gostaria de planejar?" /></label>
            <label className="mp-field full"><span>Cidade</span><input required maxLength={160} value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="Cidade onde será realizado o projeto" /></label>
          </div>}
          {step === 2 && <div className="mp-form-grid">
            <label className="mp-field"><span>Medidas aproximadas <small>(opcional)</small></span><input maxLength={500} value={form.measurements} onChange={(event) => setField("measurements", event.target.value)} placeholder="Ex.: 3 m × 2,4 m" /></label>
            <label className="mp-field"><span>Prazo desejado <small>(opcional)</small></span><input maxLength={120} value={form.desiredTimeline} onChange={(event) => setField("desiredTimeline", event.target.value)} placeholder="Quando gostaria de iniciar?" /></label>
            <label className="mp-field"><span>Faixa de investimento <small>(opcional)</small></span><select value={form.budgetRange} onChange={(event) => setField("budgetRange", event.target.value)}><option value="">Prefiro conversar</option><option>Até R$ 10 mil</option><option>R$ 10 mil a R$ 25 mil</option><option>R$ 25 mil a R$ 50 mil</option><option>Acima de R$ 50 mil</option></select></label>
            <label className="mp-field full"><span>Detalhes adicionais <small>(opcional)</small></span><textarea maxLength={4000} value={form.message} onChange={(event) => setField("message", event.target.value)} placeholder="Compartilhe outras informações que possam ajudar." /></label>
            <label className="mp-field full"><span>Referências ou fotos <small>(opcional; até 6 arquivos, 10 MB cada)</small></span><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={chooseFiles} /><span className="mp-field-hint">JPG, PNG, WebP ou PDF. Os arquivos são enviados em conexão segura para armazenamento privado.</span>{files.length > 0 && <ul className="mp-file-list">{files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MB</li>)}</ul>}</label>
          </div>}
          {step === 3 && <div className="mp-form-grid">
            <label className="mp-field full"><span>Nome</span><input autoComplete="name" required maxLength={180} value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} /></label>
            <label className="mp-field"><span>Telefone / WhatsApp</span><input autoComplete="tel" required maxLength={40} value={form.phone} onChange={(event) => setField("phone", event.target.value)} /></label>
            <label className="mp-field"><span>E-mail</span><input autoComplete="email" type="email" required maxLength={320} value={form.email} onChange={(event) => setField("email", event.target.value)} /></label>
            <label className="mp-consent full"><input type="checkbox" checked={form.privacyAccepted} onChange={(event) => setField("privacyAccepted", event.target.checked)} /><span>Li e aceito a <Link href="/privacidade">Política de privacidade</Link> e autorizo o uso dos dados para tratar esta solicitação.</span></label>
            <div className="mp-review-row full"><strong>Projeto:</strong> {form.projectType} · {form.objective} · {form.city}</div>
            <div className="mp-review-row full"><strong>Medidas / prazo / investimento:</strong> {[form.measurements, form.desiredTimeline, form.budgetRange].filter(Boolean).join(" · ") || "Não informados"}</div>
            <div className="mp-review-row full"><strong>Anexos selecionados:</strong> {files.length}</div>
          </div>}
          {error && <p className="mp-form-error" role="alert">{error}</p>}
          <div className="mp-form-actions">{step > 1 ? <button type="button" className="mp-button" onClick={previous} disabled={submitMutation.isPending}>VOLTAR</button> : <span />}{step < 3 ? <button type="button" className="mp-button" onClick={next}>CONTINUAR ↗</button> : <button type="submit" className="mp-button" disabled={submitMutation.isPending}>{submitMutation.isPending ? "ENVIANDO…" : "REVISAR E ENVIAR ↗"}</button>}</div>
        </form>
      </>}
    </div>
  </section>;
}
