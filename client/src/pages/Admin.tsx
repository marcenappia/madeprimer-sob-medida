import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useRoute } from "wouter";
import { BarChart3, ClipboardList, DollarSign, FileText, Folder, Handshake, LayoutDashboard, LogOut, MessageSquare, Package, Settings, Sparkles, Users, Wrench, type LucideIcon } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { RecordModule } from "../../../shared/types";
import { contactDefaults } from "../components/site/content";

const navigation: { slug: string; label: string; icon: LucideIcon; module?: RecordModule }[] = [
  { slug: "painel", label: "Painel", icon: LayoutDashboard },
  { slug: "projetos", label: "Projetos", icon: Folder, module: "projects" },
  { slug: "orcamentos", label: "Orçamentos", icon: ClipboardList },
  { slug: "depoimentos", label: "Depoimentos", icon: MessageSquare, module: "testimonials" },
  { slug: "servicos", label: "Serviços", icon: Wrench, module: "services" },
  { slug: "parcerias", label: "Parcerias", icon: Handshake, module: "partners" },
  { slug: "financeiro", label: "Financeiro", icon: DollarSign, module: "finance" },
  { slug: "relatorio-financeiro", label: "Relatório financeiro", icon: BarChart3 },
  { slug: "equipe", label: "Equipe", icon: Users, module: "team" },
  { slug: "estoque", label: "Estoque", icon: Package, module: "stock" },
  { slug: "atendimento-ia", label: "Atendimento IA", icon: Sparkles },
  { slug: "relatorios", label: "Relatórios", icon: FileText },
  { slug: "configuracoes", label: "Configurações", icon: Settings },
];

function money(cents: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents ?? 0) / 100);
}
function shortDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}
function Loading() { return <div className="mp-admin-loading">Verificando acesso…</div>; }
function AdminLogin() {
  const [error, setError] = useState("");
  const denied = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("access") === "denied";
  const login = () => { try { startLogin(); } catch { setError("O login seguro não está configurado para este projeto."); } };
  return <div className="mp-admin-login-wrap"><section className="mp-admin-login"><div className="mp-brand-word">MadePrimer<span>PLANEJADOS DE INTERIORES</span></div><p className="mp-eyebrow">ÁREA ADMINISTRATIVA</p><h1>MadePrimer · Admin</h1><p>Entre com a conta Manus autorizada para administrar o site.</p>{denied && <p className="mp-admin-denied" role="alert">Este e-mail não está autorizado para a área administrativa.</p>}{error && <p className="mp-admin-denied" role="alert">{error}</p>}<button className="mp-admin-button primary" type="button" onClick={login}>ENTRAR COM MANUS OAUTH</button><p className="mp-admin-note">O acesso é restrito à lista de administradores configurada no servidor.</p><Link href="/" className="mp-admin-note">Voltar ao site</Link></section></div>;
}
function AccessDenied() { return <div className="mp-admin-login-wrap"><section className="mp-admin-login"><p className="mp-eyebrow">ACESSO RESTRITO</p><h1>Acesso não autorizado</h1><p>Esta conta não tem permissão para abrir o painel administrativo.</p><Link className="mp-admin-button" href="/">Voltar ao site</Link></section></div>; }

function AdminShell({ section, user, onLogout }: { section: string; user: { name: string | null; email: string | null }; onLogout: () => void }) {
  const page = navigation.find((item) => item.slug === section);
  return <div className="mp-admin-root"><div className="mp-admin-shell">
    <aside className="mp-admin-sidebar"><div className="mp-admin-logo"><strong>MadePrimer · Admin</strong><span>Painel administrativo</span></div><nav className="mp-admin-nav" aria-label="Módulos administrativos">{navigation.map((item) => { const Icon = item.icon; const href = item.slug === "painel" ? "/admin" : `/admin/${item.slug}`; return <Link key={item.slug} href={href} className={section === item.slug ? "active" : ""}><Icon aria-hidden="true" /><span>{item.label}</span></Link>; })}</nav><button type="button" className="mp-admin-signout" onClick={onLogout}><LogOut size={16} /> Sair</button></aside>
    <main className="mp-admin-main"><header className="mp-admin-topbar"><div><p className="mp-eyebrow">MADEPRIMER · ADMIN</p><h1>{page?.label || "Painel"}</h1><p>Visão geral do seu site e solicitações.</p></div><span className="mp-admin-user">{user.name || user.email || "Conta autorizada"}</span></header>{page ? <AdminContent section={section} module={page.module} /> : <div className="mp-admin-error">Módulo não encontrado.</div>}</main>
  </div></div>;
}

function AdminGate({ section }: { section: string }) {
  const auth = useAuth();
  if (auth.loading) return <Loading />;
  if (!auth.isAuthenticated) return <AdminLogin />;
  if (auth.user?.role !== "admin") return <AccessDenied />;
  return <AdminShell section={section} user={{ name: auth.user.name, email: auth.user.email }} onLogout={() => { void auth.logout(); }} />;
}
export default function AdminPage() { return <AdminGate section="painel" />; }
export function AdminModulePage() {
  const [, params] = useRoute("/admin/:section");
  return <AdminGate section={params?.section || ""} />;
}

function AdminContent({ section, module }: { section: string; module?: RecordModule }) {
  if (section === "painel") return <Dashboard />;
  if (section === "orcamentos") return <Quotes />;
  if (section === "atendimento-ia") return <AiStatus />;
  if (section === "configuracoes") return <SettingsSection />;
  if (section === "relatorios" || section === "relatorio-financeiro") return <Reports financialOnly={section === "relatorio-financeiro"} />;
  if (module) return <RecordsModule module={module} />;
  return <div className="mp-admin-empty">Este módulo não existe.</div>;
}

function Dashboard() {
  const query = trpc.admin.overview.useQuery(undefined, { retry: false });
  if (query.isLoading) return <div className="mp-admin-empty">Carregando dados persistidos…</div>;
  if (query.error) return <div className="mp-admin-error">Não foi possível carregar os dados administrativos.</div>;
  const data = query.data;
  if (!data) return null;
  const cards = [
    ["PROJETOS PUBLICADOS", String(data.projectCount)],
    ["ORÇAMENTOS RECEBIDOS", String(data.quoteCount)],
    ["NOVOS ORÇAMENTOS", String(data.newQuoteCount)],
    ["RECEITA CONVERTIDA", money(data.convertedRevenueCents)],
    ["DEPOIMENTOS", String(data.testimonialCount)],
  ];
  return <>
    <div className="mp-admin-cards">{cards.map(([label, value]) => <article className="mp-admin-card" key={label}><span className="mp-admin-card-label">{label}</span><strong className="mp-admin-card-value">{value}</strong></article>)}</div>
    <div className="mp-admin-reports"><section className="mp-admin-panel"><h2>Financeiro</h2><p className="mp-admin-note">Totais calculados apenas a partir de lançamentos confirmados.</p><div className="mp-admin-cards"><article className="mp-admin-card"><span className="mp-admin-card-label">Receitas</span><strong className="mp-admin-card-value">{money(data.incomeCents)}</strong></article><article className="mp-admin-card"><span className="mp-admin-card-label">Despesas</span><strong className="mp-admin-card-value">{money(data.expenseCents)}</strong></article></div><p><strong>Saldo registrado: {money(data.netCents)}</strong></p></section><section className="mp-admin-panel"><h2>Orçamentos e receita por mês</h2><p className="mp-admin-note">Total de orçamentos recebidos e receita convertida.</p><p>{data.quoteCount === 0 ? "Ainda não há orçamentos registrados." : `${data.quoteCount} orçamento(s) registrados no total.`}</p></section></div>
    {data.lowStock.length > 0 && <section className="mp-admin-panel"><h2>Estoque em atenção</h2><ul>{data.lowStock.map((item) => <li className="mp-admin-low-stock" key={item.id}>{item.title}: {item.quantity} (mínimo {item.minimumQuantity})</li>)}</ul></section>}
    <section className="mp-admin-panel"><div className="mp-admin-toolbar"><h2>Orçamentos recentes</h2><Link className="mp-admin-button" href="/admin/orcamentos">VER TODOS</Link></div>{data.recentQuotes.length ? <div className="mp-admin-table-wrap"><table className="mp-admin-table"><thead><tr><th>Referência</th><th>Projeto</th><th>Cidade</th><th>Status</th><th>Data</th></tr></thead><tbody>{data.recentQuotes.map((quote) => <tr key={quote.id}><td>{quote.reference}</td><td>{quote.projectType}</td><td>{quote.city}</td><td><span className="mp-admin-status">{statusLabel(quote.status)}</span></td><td>{shortDate(quote.createdAt)}</td></tr>)}</tbody></table></div> : <div className="mp-admin-empty">Nenhum orçamento recebido.</div>}</section>
  </>;
}

const statusNames: Record<string, string> = { new: "Novo", contacted: "Em contato", converted: "Convertido", lost: "Encerrado", draft: "Rascunho", published: "Publicado", active: "Ativo", inactive: "Inativo", pending: "Pendente", confirmed: "Confirmado", archived: "Arquivado" };
function statusLabel(status: string) { return statusNames[status] || status; }

function Quotes() {
  const utils = trpc.useUtils();
  const query = trpc.admin.listQuotes.useQuery(undefined, { retry: false });
  const update = trpc.admin.updateQuoteStatus.useMutation({ onSuccess: async () => { await Promise.all([utils.admin.listQuotes.invalidate(), utils.admin.overview.invalidate()]); } });
  if (query.isLoading) return <div className="mp-admin-empty">Carregando orçamentos…</div>;
  if (query.error) return <div className="mp-admin-error">Não foi possível carregar os orçamentos.</div>;
  const quotes = query.data ?? [];
  return <section className="mp-admin-panel"><div className="mp-admin-toolbar"><div><h2>Orçamentos recebidos</h2><p className="mp-admin-note">Dados pessoais e anexos ficam disponíveis somente neste painel autorizado.</p></div><button className="mp-admin-button" onClick={() => void query.refetch()}>ATUALIZAR</button></div>{quotes.length === 0 ? <div className="mp-admin-empty">Ainda não há solicitações de orçamento.</div> : <div className="mp-admin-table-wrap"><table className="mp-admin-table"><thead><tr><th>Referência / cliente</th><th>Projeto / cidade</th><th>Contato</th><th>Status / valor</th><th>Recebido</th></tr></thead><tbody>{quotes.map((quote) => <tr key={quote.id}><td><strong>{quote.reference}</strong><br />{quote.fullName}</td><td>{quote.projectType}<br />{quote.city}</td><td><a href={`tel:${quote.phone}`}>{quote.phone}</a><br /><a href={`mailto:${quote.email}`}>{quote.email}</a></td><td><div className="mp-admin-inline-form"><select aria-label={`Status ${quote.reference}`} value={quote.status} onChange={(event) => update.mutate({ id: quote.id, status: event.target.value as "new" | "contacted" | "converted" | "lost" })}><option value="new">Novo</option><option value="contacted">Em contato</option><option value="converted">Convertido</option><option value="lost">Encerrado</option></select><input aria-label={`Valor convertido ${quote.reference}`} type="number" min="0" step="0.01" placeholder="R$" defaultValue={quote.estimatedValueCents === null ? "" : (quote.estimatedValueCents / 100).toFixed(2)} id={`value-${quote.id}`} /><button className="mp-admin-button" type="button" onClick={() => { const raw = (document.getElementById(`value-${quote.id}`) as HTMLInputElement | null)?.value; const valueCents = raw ? Math.round(Number(raw) * 100) : null; update.mutate({ id: quote.id, status: quote.status, valueCents }); }}>Salvar</button></div></td><td>{shortDate(quote.createdAt)}<details><summary>Detalhes</summary><div className="mp-admin-quote-details"><span><strong>Objetivo</strong>{quote.objective}</span><span><strong>Medidas</strong>{quote.measurements || "—"}</span><span><strong>Prazo</strong>{quote.desiredTimeline || "—"}</span><span><strong>Investimento</strong>{quote.budgetRange || "—"}</span><span><strong>Observação</strong>{quote.message || "—"}</span><span><strong>Privacidade aceita em</strong>{shortDate(quote.privacyAcceptedAt)}</span><span><strong>Anexos</strong>{quote.attachments.length ? quote.attachments.map((file) => <AttachmentLink key={file.id} id={file.id} name={file.originalName} />) : "Nenhum"}</span></div></details></td></tr>)}</tbody></table></div>}{update.error && <p className="mp-admin-error">Não foi possível atualizar o status ou valor.</p>}</section>;
}
function AttachmentLink({ id, name }: { id: number; name: string }) {
  const download = trpc.admin.attachmentDownload.useMutation();
  return <button className="mp-admin-button" type="button" disabled={download.isPending} onClick={async () => { try { const url = await download.mutateAsync({ id }); window.open(url, "_blank", "noopener,noreferrer"); } catch { window.alert("Não foi possível abrir este anexo."); } }}>{name}</button>;
}

type AdminField = { key: string; label: string; type: "text" | "textarea" | "url" | "number" | "date" | "select" | "email"; required?: boolean; options?: string[] };
const baseFields: AdminField[] = [
  { key: "title", label: "Título / nome", type: "text", required: true },
  { key: "category", label: "Categoria", type: "text" },
  { key: "description", label: "Descrição / conteúdo", type: "textarea" },
];
function fieldDefinitions(module: RecordModule): AdminField[] {
  if (module === "projects") return [...baseFields, { key: "url", label: "URL da imagem (opcional)", type: "url" }, { key: "status", label: "Status", type: "select", options: ["draft", "published"] }];
  if (module === "testimonials") return [...baseFields, { key: "status", label: "Status", type: "select", options: ["draft", "published"] }];
  if (module === "services") return [...baseFields, { key: "status", label: "Status", type: "select", options: ["active", "inactive"] }];
  if (module === "partners") return [...baseFields, { key: "url", label: "Site do parceiro (opcional)", type: "url" }, { key: "status", label: "Status", type: "select", options: ["active", "inactive"] }];
  if (module === "finance") return [baseFields[0], { key: "amount", label: "Valor (R$)", type: "number", required: true }, { key: "direction", label: "Tipo", type: "select", options: ["income", "expense"] }, { key: "date", label: "Data", type: "date", required: true }, { key: "status", label: "Status", type: "select", options: ["pending", "confirmed"] }, baseFields[2]];
  if (module === "team") return [baseFields[0], { key: "category", label: "Função", type: "text" }, { key: "email", label: "E-mail", type: "email" }, { key: "phone", label: "Telefone", type: "text" }, { key: "status", label: "Status", type: "select", options: ["active", "inactive"] }];
  return [baseFields[0], { key: "category", label: "Categoria", type: "text" }, { key: "sku", label: "Código / SKU", type: "text" }, { key: "quantity", label: "Quantidade inicial", type: "number", required: true }, { key: "minimumQuantity", label: "Estoque mínimo", type: "number", required: true }, { key: "unit", label: "Unidade", type: "text" }, { key: "status", label: "Status", type: "select", options: ["active", "inactive"] }];
}
function defaultValues(module: RecordModule): Record<string, string> {
  return { title: "", category: "", description: "", status: module === "projects" || module === "testimonials" ? "draft" : module === "finance" ? "pending" : "active", amount: "", direction: "income", date: new Date().toISOString().slice(0, 10), url: "", email: "", phone: "", quantity: "0", minimumQuantity: "0", unit: "un", sku: "" };
}
function RecordsModule({ module }: { module: RecordModule }) {
  const utils = trpc.useUtils();
  const query = trpc.admin.listRecords.useQuery({ module }, { retry: false });
  const create = trpc.admin.createRecord.useMutation({ onSuccess: async () => { await Promise.all([utils.admin.listRecords.invalidate({ module }), utils.admin.overview.invalidate()]); } });
  const edit = trpc.admin.updateRecord.useMutation({ onSuccess: async () => { await Promise.all([utils.admin.listRecords.invalidate({ module }), utils.admin.overview.invalidate()]); } });
  const archive = trpc.admin.archiveRecord.useMutation({ onSuccess: async () => { await Promise.all([utils.admin.listRecords.invalidate({ module }), utils.admin.overview.invalidate()]); } });
  const [values, setValues] = useState<Record<string, string>>(() => defaultValues(module));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");
  const fields = fieldDefinitions(module);
  const title = navigation.find((item) => item.module === module)?.label ?? "Registros";
  const rows = useMemo(() => (query.data ?? []).filter((row) => `${row.title} ${row.category ?? ""} ${row.description ?? ""}`.toLowerCase().includes(search.toLowerCase())), [query.data, search]);
  const reset = () => { setEditingId(null); setFormError(""); setValues(defaultValues(module)); };
  const beginEdit = (row: NonNullable<typeof query.data>[number]) => {
    const rowData: Record<string, unknown> = { ...(row.data ?? {}), title: row.title, category: row.category ?? "", description: row.description ?? "", status: row.status, url: row.url ?? "", amount: row.amountCents === null ? "" : (row.amountCents / 100).toFixed(2), direction: row.direction ?? "income", quantity: String(row.quantity ?? 0), minimumQuantity: String(row.minimumQuantity ?? 0), unit: row.unit ?? "un" };
    setValues(Object.fromEntries(Object.entries(rowData).map(([key, value]) => [key, String(value ?? "")])));
    setEditingId(row.id);
    setFormError("");
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    const data: Record<string, unknown> = { ...values };
    try {
      if (editingId === null) await create.mutateAsync({ module, data });
      else await edit.mutateAsync({ id: editingId, module, data });
      reset();
    } catch {
      setFormError("Revise os campos e tente salvar novamente.");
    }
  };
  return <>
    <section className="mp-admin-panel"><div className="mp-admin-toolbar"><div><h2>{editingId ? "Editar registro" : `Novo registro · ${title}`}</h2><p className="mp-admin-note">Os dados são persistidos no banco do projeto.</p></div></div><form className="mp-admin-form" onSubmit={save}>{fields.filter((field) => !(module === "stock" && editingId !== null && field.key === "quantity")).map((field) => <label className="mp-field" key={field.key}><span>{field.label}</span>{field.type === "textarea" ? <textarea required={Boolean(field.required)} maxLength={field.key === "description" ? 5000 : 500} value={values[field.key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} /> : field.type === "select" ? <select value={values[field.key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}>{(field.options ?? []).map((option) => <option key={option} value={option}>{statusLabel(option)}</option>)}</select> : <input type={field.type} required={Boolean(field.required)} min={field.type === "number" ? "0" : undefined} step={field.key === "amount" ? "0.01" : field.type === "number" ? "1" : undefined} maxLength={field.type === "text" ? 320 : undefined} value={values[field.key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} />}</label>)}{formError && <p className="mp-admin-error">{formError}</p>}<div className="mp-admin-form-actions"><button className="mp-admin-button primary" type="submit" disabled={create.isPending || edit.isPending}>{editingId ? "SALVAR ALTERAÇÕES" : "CRIAR REGISTRO"}</button>{editingId !== null && <button className="mp-admin-button" type="button" onClick={reset}>CANCELAR</button>}</div></form></section>
    <section className="mp-admin-panel"><div className="mp-admin-toolbar"><h2>{title}</h2><input className="mp-admin-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar registros" aria-label="Buscar registros" /></div>{query.isLoading ? <div className="mp-admin-empty">Carregando…</div> : query.error ? <div className="mp-admin-error">Não foi possível carregar os registros.</div> : rows.length === 0 ? <div className="mp-admin-empty">Nenhum registro persistido ainda.</div> : <div className="mp-admin-table-wrap"><table className="mp-admin-table"><thead><tr><th>Título</th><th>Categoria / detalhes</th><th>Status</th>{module === "finance" && <th>Valor</th>}{module === "stock" && <th>Estoque</th>}<th>Ações</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.title}</strong>{row.description && <div className="mp-admin-note">{row.description}</div>}</td><td>{row.category || "—"}{module === "team" && row.data?.email ? <div>{String(row.data.email)}</div> : null}</td><td><span className="mp-admin-status">{statusLabel(row.status)}</span></td>{module === "finance" && <td>{money(row.amountCents)}</td>}{module === "stock" && <td className={(row.quantity ?? 0) <= (row.minimumQuantity ?? 0) ? "mp-admin-low-stock" : ""}>{row.quantity ?? 0} {row.unit || "un"} · mín. {row.minimumQuantity ?? 0}<StockAdjustment id={row.id} /></td>}<td><div className="mp-admin-inline-form"><button type="button" className="mp-admin-button" onClick={() => beginEdit(row)}>EDITAR</button><button type="button" className="mp-admin-button danger" onClick={() => { if (window.confirm(`Arquivar “${row.title}”?`)) archive.mutate({ id: row.id }); }}>ARQUIVAR</button></div></td></tr>)}</tbody></table></div>}{archive.error && <p className="mp-admin-error">Não foi possível arquivar este registro.</p>}</section>
  </>;
}
function StockAdjustment({ id }: { id: number }) {
  const [delta, setDelta] = useState("");
  const utils = trpc.useUtils();
  const mutation = trpc.admin.adjustStock.useMutation({ onSuccess: async () => { setDelta(""); await utils.admin.listRecords.invalidate({ module: "stock" }); } });
  return <form className="mp-admin-stock-adjust" onSubmit={(event) => { event.preventDefault(); const amount = Number(delta); if (amount) mutation.mutate({ id, delta: amount, note: "Ajuste pelo painel" }); }}><input type="number" step="1" value={delta} onChange={(event) => setDelta(event.target.value)} placeholder="± un." aria-label="Variação de estoque" /><button type="submit" className="mp-admin-button" disabled={mutation.isPending || !delta}>Ajustar</button></form>;
}

function SettingsSection() {
  const utils = trpc.useUtils();
  const query = trpc.admin.settings.useQuery(undefined, { retry: false });
  const save = trpc.admin.saveSetting.useMutation({ onSuccess: async () => { await Promise.all([utils.admin.settings.invalidate(), utils.site.publicSettings.invalidate()]); } });
  const [values, setValues] = useState<Record<string, string>>({ phonePrimary: contactDefaults.phonePrimary, phoneSecondary: contactDefaults.phoneSecondary, address: contactDefaults.address });
  useEffect(() => { if (query.data) setValues((current) => ({ ...current, ...Object.fromEntries(query.data.map((item) => [item.settingKey, item.settingValue])) })); }, [query.data]);
  const labels: Record<string, string> = { phonePrimary: "Telefone / WhatsApp principal", phoneSecondary: "Telefone secundário", address: "Endereço" };
  return <section className="mp-admin-panel"><h2>Informações públicas</h2><p className="mp-admin-note">Os dados salvos aparecem no rodapé do site. Não coloque segredos ou credenciais aqui.</p>{query.error && <div className="mp-admin-error">Não foi possível carregar as configurações.</div>}<div className="mp-admin-form">{Object.entries(labels).map(([key, label]) => <label className="mp-field" key={key}><span>{label}</span><input value={values[key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} maxLength={250} /></label>)}</div><div className="mp-admin-form-actions" style={{ marginTop: 16 }}>{Object.keys(labels).map((key) => <button key={key} className="mp-admin-button primary" type="button" disabled={save.isPending || query.isLoading} onClick={() => save.mutate({ key, value: values[key] ?? "" })}>SALVAR {labels[key].toUpperCase()}</button>)}</div>{save.error && <p className="mp-admin-error">Não foi possível salvar a configuração.</p>}</section>;
}

function Reports({ financialOnly }: { financialOnly: boolean }) {
  const report = trpc.admin.reportData.useQuery(undefined, { retry: false });
  const overview = trpc.admin.overview.useQuery(undefined, { retry: false });
  const exportCsv = () => {
    const records = report.data?.finance ?? [];
    const rows = [["Título", "Tipo", "Status", "Valor (R$)", "Data"], ...records.map((record) => [record.title, record.direction ?? "", record.status, ((record.amountCents ?? 0) / 100).toFixed(2), String(record.data?.date ?? shortDate(record.createdAt))])];
    const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "madeprimer-relatorio-financeiro.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  if (report.isLoading || overview.isLoading) return <div className="mp-admin-empty">Carregando relatórios…</div>;
  if (report.error || overview.error) return <div className="mp-admin-error">Não foi possível gerar o relatório.</div>;
  const data = overview.data;
  return <><div className="mp-admin-cards"><article className="mp-admin-card"><span className="mp-admin-card-label">Orçamentos recebidos</span><strong className="mp-admin-card-value">{data?.quoteCount ?? 0}</strong></article><article className="mp-admin-card"><span className="mp-admin-card-label">Orçamentos convertidos</span><strong className="mp-admin-card-value">{report.data?.quoteStatuses.find((item) => item.status === "converted")?.total ?? 0}</strong></article>{financialOnly && <><article className="mp-admin-card"><span className="mp-admin-card-label">Receita confirmada</span><strong className="mp-admin-card-value">{money(data?.incomeCents)}</strong></article><article className="mp-admin-card"><span className="mp-admin-card-label">Saldo registrado</span><strong className="mp-admin-card-value">{money(data?.netCents)}</strong></article></>}</div><section className="mp-admin-panel"><div className="mp-admin-toolbar"><div><h2>{financialOnly ? "Relatório financeiro" : "Relatórios"}</h2><p className="mp-admin-note">Os resultados são calculados a partir dos dados persistidos, sem números de demonstração.</p></div>{financialOnly && <button className="mp-admin-button" onClick={exportCsv}>EXPORTAR CSV</button>}</div><p>Orçamentos: {(report.data?.quoteStatuses ?? []).map((row) => `${statusLabel(row.status)}: ${row.total}`).join(" · ") || "Nenhum registro"}</p>{financialOnly ? <div className="mp-admin-table-wrap"><table className="mp-admin-table"><thead><tr><th>Lançamento</th><th>Tipo</th><th>Status</th><th>Valor</th><th>Data</th></tr></thead><tbody>{(report.data?.finance ?? []).map((record) => <tr key={record.id}><td>{record.title}</td><td>{record.direction === "income" ? "Receita" : "Despesa"}</td><td>{statusLabel(record.status)}</td><td>{money(record.amountCents)}</td><td>{String(record.data?.date ?? shortDate(record.createdAt))}</td></tr>)}</tbody></table></div> : <p>Os indicadores do painel são atualizados conforme orçamentos, projetos, estoque e lançamentos forem cadastrados.</p>}</section></>;
}

function AiStatus() { return <section className="mp-admin-panel"><p className="mp-eyebrow">ATENDIMENTO IA</p><h2>Inativo nesta entrega</h2><div className="mp-admin-warning">Este módulo não chama modelos, não envia dados para serviços de IA e não executa automações. A ativação exigirá configuração e autorização futuras. Qualquer visualização conceitual futura deverá conter: “Visualização conceitual — não é projeto executivo.”</div></section>; }
