import type { ReactNode } from "react";
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
export function ArchitectsPage() { return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="PARA ARQUITETOS E DESIGNERS" title={<>Você cria o projeto.<br /><em>A gente ajuda a fazê-lo acontecer.</em></>} /><Link href="/contato" className="mp-button">COMO FUNCIONA A PARCERIA <Arrow /></Link></section>; }
export function ProcessPage() { return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="PROCESSO" title="Processo" /><ol className="mp-process-list">{processSteps.map((step, index) => <li key={step}><span className="mp-step-number">0{index + 1}</span><h2>{step}</h2></li>)}</ol><Link href="/orcamento" className="mp-button">CONHEÇA O PROCESSO <Arrow /></Link></section>; }
export function PartnersPage() { return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="PARCEIROS" title="Um bom projeto é feito de boas escolhas." /><PartnerNames /><p className="mp-partner-description">{partnerDescription}</p><Link href="/parceiros" className="mp-text-link">NOSSOS PARCEIROS <Arrow /></Link><ClosingCallout /></section>; }
export function AboutPage() { return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="SOBRE" title="MADEPRIMER · PLANEJADOS DE INTERIORES" /> <p className="mp-lead">{companyDescription}</p><ClosingCallout /></section>; }
export function ContactPage() {
  const { data } = trpc.site.publicSettings.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const phone = data?.phonePrimary || contactDefaults.phonePrimary;
  const secondary = data?.phoneSecondary || contactDefaults.phoneSecondary;
  const digits = phone.replace(/\D/g, "");
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="CONTATO" title="Vamos conversar sobre seu próximo projeto?" /><div className="mp-contact-details"><a href={`https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`}>{phone}</a><a href={`tel:${secondary.replace(/[^+\d]/g, "")}`}>{secondary}</a><address>{data?.address || contactDefaults.address}<br />Jandira — SP</address></div><Link href="/orcamento" className="mp-button">SOLICITAR ORÇAMENTO <Arrow /></Link></section>;
}
export function MyAccountPage() { return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="MINHA CONTA" title="MINHA CONTA" /><div className="mp-info-panel"><p>O acesso à conta de cliente não está habilitado nesta versão.</p><Link href="/orcamento" className="mp-text-link">SOLICITAR ORÇAMENTO <Arrow /></Link></div></section>; }
export function PrivacyPage() { return <section className="mp-section mp-inner-page mp-privacy"><SectionIntro eyebrow="INFORMAÇÕES" title="Política de privacidade" /><p className="mp-review-note">Rascunho para revisão jurídica antes da publicação.</p><h2>Dados enviados pelo formulário</h2><p>Ao solicitar um orçamento, você pode informar nome, telefone, e-mail, cidade, ambiente, objetivo, medidas aproximadas, prazo, faixa de investimento e anexar imagens ou PDFs de referência. O aceite da política é solicitado antes do envio.</p><h2>Uso e armazenamento</h2><p>Essas informações são armazenadas no banco de dados do site MadePrimer e são usadas para receber, analisar e acompanhar a solicitação. Os anexos são armazenados em área privada e podem ser acessados somente por administradores autorizados da MadePrimer. Nesta versão não há envio da solicitação para CRM, e-mail de terceiros, campanhas de publicidade ou serviços de inteligência artificial.</p><h2>Contato e revisão</h2><p>Para falar sobre uma solicitação, use os contatos publicados nesta página. Os prazos de retenção, procedimentos de exclusão e demais informações legais devem ser revisados e complementados pela MadePrimer antes de qualquer publicação oficial.</p><p className="mp-privacy-contact">(11) 97975-6780 · (11) 98865-3576</p></section>; }
