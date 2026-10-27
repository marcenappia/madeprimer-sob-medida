import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { companyDescription, contactDefaults, corporateDescription, partnerDescription, portfolioItems, processSteps, residentialDescription, type PortfolioItem } from "../components/site/content";

const Arrow = () => <span aria-hidden="true">↗</span>;
function SectionIntro({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return <header className="mp-section-intro">{eyebrow && <p className="mp-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children && <p className="mp-lead">{children}</p>}</header>;
}
function PortfolioGrid({ filter = "all" }: { filter?: "all" | "residential" | "corporate" }) {
  const { data } = trpc.site.projects.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const dynamicItems: PortfolioItem[] = (data ?? []).map((item, index) => ({
    number: String(index + 1).padStart(2, "0"),
    category: item.category || "PROJETO",
    title: item.title,
    image: item.url || undefined,
    alt: item.title,
    temporary: !item.url,
  }));
  const sourceItems = dynamicItems.length ? dynamicItems : portfolioItems;
  const items = sourceItems.filter((item) => filter === "all" || (filter === "corporate" ? item.category.toUpperCase().includes("CORPORATIVO") : !item.category.toUpperCase().includes("CORPORATIVO")));
  return <div className="mp-project-grid">{items.map((item) => <article className="mp-project-card" key={`${item.number}-${item.category}-${item.title}`}>
    {item.image ? <img className="mp-project-image" src={item.image} alt={item.alt || item.title} loading="lazy" /> : <div className="mp-image-placeholder" role="img" aria-label={`Imagem temporária: ${item.title}`}><span>Imagem temporária</span></div>}
    <div className="mp-project-copy"><div className="mp-project-meta"><span>{item.number}</span><p className="mp-eyebrow">{item.category}</p></div><h2>{item.title}</h2></div>
  </article>)}</div>;
}
function ClosingCallout() {
  return <section className="mp-closing"><p className="mp-eyebrow">MADEPRIMER · PLANEJADOS DE INTERIORES</p><h2>Vamos conversar sobre seu próximo projeto?</h2><Link href="/contato" className="mp-button">FALAR COM A MADEPRIMER <Arrow /></Link></section>;
}
function PartnerNames() {
  const { data } = trpc.site.partners.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const names = data?.length ? data.map((partner) => partner.title) : ["EMBRACON CONSÓRCIOS", "LEME"];
  return <div className="mp-partner-list">{names.map((name, index) => <span key={`${name}-${index}`}>{name}</span>)}</div>;
}

export function HomePage() {
  return <>
    <section className="mp-hero"><div className="mp-hero-rule" aria-hidden="true" /><div className="mp-hero-content"><p className="mp-eyebrow">MADEPRIMER · PLANEJADOS DE INTERIORES</p><h1>O toque fino da<br /><em>marcenaria premium.</em></h1><Link href="/projetos" className="mp-button">CONHEÇA NOSSOS PROJETOS <Arrow /></Link></div></section>
    <section className="mp-manifesto"><p className="mp-eyebrow">MANIFESTO</p><h2>O luxo está nos detalhes.</h2><p>{companyDescription}</p></section>
    <section className="mp-section" id="projetos"><div className="mp-section-heading"><div><p className="mp-eyebrow">PORTFÓLIO</p><h2>Projetos</h2></div><Link href="/projetos" className="mp-text-link">VER TODOS <Arrow /></Link></div><PortfolioGrid /></section>
    <section className="mp-feature-section mp-feature-residential"><div className="mp-feature-copy"><p className="mp-eyebrow">RESIDENCIAL</p><h2>Para viver bem, cada detalhe precisa fazer sentido.</h2><p>{residentialDescription}</p><Link href="/residencial" className="mp-text-link">VER PROJETOS RESIDENCIAIS <Arrow /></Link></div><div className="mp-feature-projects"><PortfolioGrid filter="residential" /></div></section>
    <section className="mp-feature-section mp-feature-corporate"><div className="mp-feature-copy"><p className="mp-eyebrow">CORPORATIVO</p><h2>Ambientes também comunicam marcas.</h2><p>{corporateDescription}</p><p className="mp-tags">ÁREAS DE TRABALHO · DIVISÓRIAS RIPADAS · MARCENARIA CORPORATIVA</p><Link href="/corporativo" className="mp-text-link">CONHEÇA O CORPORATIVO <Arrow /></Link></div><div className="mp-feature-projects"><PortfolioGrid filter="corporate" /></div></section>
    <section className="mp-architect-callout"><p className="mp-eyebrow">PARA ARQUITETOS E DESIGNERS</p><h2>Você cria o projeto.<br /><em>A gente ajuda a fazê-lo acontecer.</em></h2><Link href="/arquitetos" className="mp-text-link">COMO FUNCIONA A PARCERIA <Arrow /></Link></section>
    <section className="mp-section mp-process"><div className="mp-section-heading"><div><p className="mp-eyebrow">PROCESSO</p><h2>PROCESSO</h2></div><Link href="/processo" className="mp-text-link">CONHEÇA O PROCESSO <Arrow /></Link></div><ol className="mp-process-list">{processSteps.map((step, index) => <li key={step}><span className="mp-step-number">0{index + 1}</span><h3>{step}</h3></li>)}</ol></section>
    <section className="mp-section mp-partners-section"><div className="mp-section-heading"><div><p className="mp-eyebrow">PARCEIROS</p><h2>Um bom projeto é feito de boas escolhas.</h2></div><Link href="/parceiros" className="mp-text-link">NOSSOS PARCEIROS <Arrow /></Link></div><PartnerNames /><p className="mp-partner-description">{partnerDescription}</p></section>
    <ClosingCallout />
  </>;
}

export function PortfolioPage() { return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="PORTFÓLIO" title="Projetos" /><PortfolioGrid /><ClosingCallout /></section>; }
export function ResidentialPage() { return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="RESIDENCIAL" title="Para viver bem, cada detalhe precisa fazer sentido.">{residentialDescription}</SectionIntro><PortfolioGrid filter="residential" /><Link href="/projetos" className="mp-button">VER PROJETOS RESIDENCIAIS <Arrow /></Link></section>; }
export function CorporatePage() { return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="CORPORATIVO" title="Ambientes também comunicam marcas.">{corporateDescription}</SectionIntro><p className="mp-tags">ÁREAS DE TRABALHO · DIVISÓRIAS RIPADAS · MARCENARIA CORPORATIVA</p><PortfolioGrid filter="corporate" /><Link href="/corporativo" className="mp-button">CONHEÇA O CORPORATIVO <Arrow /></Link></section>; }
function PartnerApplicationForm() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const submitQuote = trpc.site.submitQuote.useMutation({
    onSuccess: () => {
      setNotice("Recebemos sua solicitação. Nossa equipe entrará em contato em até 1 dia útil.");
      setError("");
      setPending(false);
      const form = document.getElementById("partner-application") as HTMLFormElement | null;
      form?.reset();
    },
    onError: (err) => {
      setError(err.message || "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.");
      setPending(false);
    },
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setNotice("");
    setError("");
    setPending(true);
    submitQuote.mutate({
      projectType: "Parceria com arquiteto ou designer",
      objective: String(data.get("office") || "Cadastro de parceiro"),
      city: String(data.get("city") || ""),
      measurements: "",
      desiredTimeline: "",
      budgetRange: "",
      message: [
        "Solicitação de parceria MadePrimer",
        "Escritório: " + String(data.get("office") || "Não informado"),
        "Instagram/site: " + String(data.get("website") || "Não informado"),
        "Área de atuação: " + String(data.get("area") || "Não informado"),
        "Mensagem: " + String(data.get("message") || "Não informada"),
      ].join("\\n"),
      fullName: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      privacyAccepted: data.get("privacy") === "on",
      attachmentCount: 0,
    });
  }
  return <form id="partner-application" onSubmit={submit} className="mp-form">
    <div className="mp-form-grid">
      <label>Nome completo<input name="name" autoComplete="name" required minLength={2} /></label>
      <label>Escritório / empresa<input name="office" autoComplete="organization" required minLength={2} /></label>
      <label>E-mail profissional<input name="email" type="email" autoComplete="email" required /></label>
      <label>WhatsApp<input name="phone" type="tel" autoComplete="tel" required minLength={8} placeholder="(11) 99999-9999" /></label>
      <label>Cidade e região atendida<input name="city" autoComplete="address-level2" required minLength={2} /></label>
      <label>Site ou Instagram<input name="website" type="text" placeholder="@seuescritorio ou site.com.br" /></label>
      <label>Área de atuação<select name="area" defaultValue="Residencial"><option>Residencial</option><option>Corporativo</option><option>Residencial e corporativo</option></select></label>
      <label className="mp-form-wide">Conte um pouco sobre os projetos e a parceria desejada<textarea name="message" rows={4} /></label>
    </div>
    <label className="mp-consent"><input name="privacy" type="checkbox" required /> Li e concordo com a política de privacidade e autorizo o contato sobre esta solicitação.</label>
    {error && <p className="mp-form-error" role="alert">{error}</p>}
    {notice && <p className="mp-form-success" role="status">{notice}</p>}
    <button className="mp-button" type="submit" disabled={pending}>{pending ? "ENVIANDO…" : "ENVIAR CADASTRO"} <Arrow /></button>
    <p className="mp-form-note">Se preferir, fale diretamente com a equipe pelo WhatsApp na página de contato.</p>
  </form>;
}

export function ArchitectsPage() {
  const points = [
    ["Fidelidade ao projeto", "Respeitamos conceito, medidas, materiais e linguagem. O que foi definido é a referência para a execução."],
    ["Precisão na execução", "Do projeto executivo à instalação, com acompanhamento das etapas de produção e montagem."],
    ["Parceria", "Uma relação pensada para projetos atuais e futuros, com comunicação direta e alinhamento de expectativas."],
  ];
  return <><section className="mp-section mp-inner-page mp-editorial-page">
    <SectionIntro eyebrow="PARA ARQUITETOS E DESIGNERS" title={<>Você cria o projeto.<br /><em>A MadePrimer ajuda a fazê-lo acontecer.</em></>} >Você projeta. A MadePrimer executa. Uma parceria para transformar especificações em ambientes sob medida.</SectionIntro>
    <div className="mp-value-grid">{points.map(([title, text]) => <article className="mp-value-card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</div>
  </section><section className="mp-section mp-inner-page" id="parceria"><SectionIntro eyebrow="MADEPRIMER PARTNERS" title="Vamos construir uma boa parceria?" >Preencha seus dados para apresentar seu escritório e conversar com nossa equipe. Retornaremos em até 1 dia útil.</SectionIntro><PartnerApplicationForm /></section></>;
}
export function ProcessPage() { return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="PROCESSO" title="Do projeto à instalação" >Etapas claras para alinhar expectativas, especificações e execução.</SectionIntro><ol className="mp-process-list">{processSteps.map((step, index) => <li key={step}><span className="mp-step-number">0{index + 1}</span><h2>{step}</h2></li>)}</ol><p className="mp-lead">Cada projeto é analisado conforme o ambiente, as medidas, os materiais especificados e as necessidades de instalação.</p><Link href="/orcamento" className="mp-button">CONVERSAR SOBRE UM PROJETO <Arrow /></Link></section>; }
export function PartnersPage() { return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="PARCEIROS" title="Um bom projeto é feito de boas escolhas." >Trabalhamos em conjunto com profissionais e parceiros para ampliar as possibilidades de cada ambiente.</SectionIntro><PartnerNames /><p className="mp-partner-description">{partnerDescription}</p><div className="mp-info-panel"><h2>Você é arquiteto ou designer?</h2><p>Conheça o programa de parceria MadePrimer para projetos residenciais e corporativos.</p><Link href="/arquitetos" className="mp-button">CONHEÇA A PARCERIA <Arrow /></Link></div><ClosingCallout /></section>; }
export function AboutPage() {
  const values = [
    ["Fidelidade ao projeto", "Respeito às especificações, às medidas e à intenção de cada ambiente."],
    ["Compromisso com prazos", "Alinhamento de etapas e comunicação durante a execução."],
    ["Personalização", "Soluções sob medida para a rotina e a identidade de cada cliente."],
    ["Transparência", "Informações claras e diálogo do primeiro contato à instalação."],
    ["Profissionais especializados", "Atenção à técnica, aos materiais e aos detalhes de acabamento."],
    ["Soluções funcionais", "Escolhas que conciliam estética, uso e características do espaço."],
  ];
  return <><section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="SOBRE A MADEPRIMER" title="Marcenaria sob medida. Do projeto à execução." >Criamos e executamos marcenaria para ambientes residenciais e corporativos, respeitando a identidade de cada espaço e as necessidades de quem vai utilizá-lo.</SectionIntro><p className="mp-lead">{companyDescription}</p></section><section className="mp-section mp-about-mission"><div><p className="mp-eyebrow">MISSÃO</p><h2>Transformar projetos em ambientes que fazem sentido.</h2><p>Unir planejamento, materiais e execução para criar marcenaria sob medida que responda às necessidades reais de cada cliente.</p></div><div><p className="mp-eyebrow">VISÃO</p><h2>Ser uma parceira confiável em cada etapa.</h2><p>Construir relações duradouras com clientes, arquitetos e designers, com comunicação clara e atenção aos detalhes.</p></div></section><section className="mp-section"><SectionIntro eyebrow="NOSSOS PRINCÍPIOS" title="Valores que orientam o trabalho" /><div className="mp-value-grid">{values.map(([title,text])=><article className="mp-value-card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</div></section><ClosingCallout /></>;
}
export function ContactPage() {
  const { data } = trpc.site.publicSettings.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const phone = data?.phonePrimary || contactDefaults.phonePrimary;
  const secondary = data?.phoneSecondary || contactDefaults.phoneSecondary;
  const digits = phone.replace(/\\D/g, "");
  const whatsapp = `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="CONTATO" title="Vamos conversar sobre seu próximo projeto?" >Conte sobre seu ambiente, suas ideias ou a parceria que deseja construir com a MadePrimer.</SectionIntro><div className="mp-contact-details"><div><p className="mp-eyebrow">WHATSAPP</p><a href={whatsapp} target="_blank" rel="noreferrer">{phone}</a></div><div><p className="mp-eyebrow">TELEFONE</p><a href={`tel:${secondary.replace(/[^+\\d]/g, "")}`}>{secondary}</a></div><div><p className="mp-eyebrow">ENDEREÇO</p><address>{data?.address || contactDefaults.address}<br />{contactDefaults.city}</address></div><div><p className="mp-eyebrow">ÁREA DE ATENDIMENTO</p><p>Grande São Paulo e região</p></div></div><div className="mp-info-panel"><h2>Já tem as informações do projeto?</h2><p>Envie os dados para análise e solicite um orçamento.</p><Link href="/orcamento" className="mp-button">SOLICITAR ORÇAMENTO <Arrow /></Link></div></section>;
}
export function PrivacyPage() { return <section className="mp-section mp-inner-page mp-privacy"><SectionIntro eyebrow="INFORMAÇÕES LEGAIS" title="Política de privacidade" >Como tratamos as informações enviadas pelos formulários da MadePrimer.</SectionIntro><p className="mp-review-note">Documento informativo sujeito à revisão jurídica e à confirmação dos procedimentos reais de tratamento de dados antes da publicação.</p><h2>1. Dados que podem ser coletados</h2><p>Ao preencher formulários, você poderá fornecer nome, telefone, e-mail, cidade, informações sobre o ambiente e o projeto, preferências, prazo e outros detalhes necessários para o atendimento. Se o formulário permitir anexos, estes também poderão conter informações pessoais.</p><h2>2. Finalidade de uso</h2><p>As informações são utilizadas para responder ao contato, analisar solicitações, preparar propostas e acompanhar a comunicação relacionada ao projeto ou à parceria.</p><h2>3. Compartilhamento e armazenamento</h2><p>O acesso deve ser limitado às pessoas autorizadas que precisam dessas informações para atender à solicitação. Os serviços técnicos que armazenam ou processam os dados devem ser confirmados pela empresa, assim como seus prazos de retenção e medidas de segurança.</p><h2>4. Seus direitos</h2><p>Nos termos da legislação aplicável, incluindo a LGPD, você pode solicitar informações sobre o tratamento de seus dados, correção e, quando aplicável, exclusão ou outras providências previstas em lei.</p><h2>5. Contato</h2><p>Para solicitações relacionadas à privacidade, entre em contato pelos canais oficiais da MadePrimer. Antes da publicação definitiva, a empresa deve indicar um canal responsável e confirmar os procedimentos para atendimento dos titulares.</p><p className="mp-review-note">Última revisão editorial: outubro de 2026.</p></section>; }
export function MyAccountPage() { return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="MINHA CONTA" title="MINHA CONTA" /><div className="mp-info-panel"><p>O acesso à conta de cliente não está habilitado nesta versão.</p><Link href="/orcamento" className="mp-text-link">SOLICITAR ORÇAMENTO <Arrow /></Link></div></section>; }
export function PrivacyPage() { return <section className="mp-section mp-inner-page mp-privacy"><SectionIntro eyebrow="INFORMAÇÕES" title="Política de privacidade" /><p className="mp-review-note">Rascunho para revisão jurídica antes da publicação.</p><h2>Dados enviados pelo formulário</h2><p>Ao solicitar um orçamento, você pode informar nome, telefone, e-mail, cidade, ambiente, objetivo, medidas aproximadas, prazo, faixa de investimento e anexar imagens ou PDFs de referência. O aceite da política é solicitado antes do envio.</p><h2>Uso e armazenamento</h2><p>Essas informações são armazenadas no banco de dados do site MadePrimer e são usadas para receber, analisar e acompanhar a solicitação. Os anexos são armazenados em área privada e podem ser acessados somente por administradores autorizados da MadePrimer. Nesta versão não há envio da solicitação para CRM, e-mail de terceiros, campanhas de publicidade ou serviços de inteligência artificial.</p><h2>Contato e revisão</h2><p>Para falar sobre uma solicitação, use os contatos publicados nesta página. Os prazos de retenção, procedimentos de exclusão e demais informações legais devem ser revisados e complementados pela MadePrimer antes de qualquer publicação oficial.</p><p className="mp-privacy-contact">(11) 97975-6780 · (11) 98865-3576</p></section>; }
