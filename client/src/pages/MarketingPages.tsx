import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  base44Projects,
  contactDefaults,
  corporateDescription,
  corporatePageDescription,
  heroImage,
  partnerDescription,
  portfolioCtaDescription,
  portfolioItems,
  portfolioPageDescription,
  processSteps,
  projectDetailCtaDescription,
  projectFilters,
  projectGroups,
  residentialDescription,
  residentialFeatureImage,
  residentialPageDescription,
  type PortfolioItem,
  type ProjectImage,
} from "../components/site/content";

const Arrow = () => <span aria-hidden="true">↗</span>;

type Filter = (typeof projectFilters)[number];

function SectionIntro({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return <header className="mp-section-intro">
    {eyebrow && <p className="mp-eyebrow">{eyebrow}</p>}
    <h1>{title}</h1>
    {children && <p className="mp-lead">{children}</p>}
  </header>;
}

function GalleryImage({ image, className = "mp-project-image", loading = "lazy" }: { image: ProjectImage; className?: string; loading?: "lazy" | "eager" }) {
  if (image.unavailable) {
    return <div className={`${className} mp-image-unavailable`} role="img" aria-label="Imagem indisponível na referência Base44"><span>Imagem indisponível na referência Base44</span></div>;
  }
  return <img className={className} src={image.src} alt={image.alt} loading={loading} decoding="async" />;
}

function ProjectCard({ item, number }: { item: PortfolioItem; number?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = item.images;
  const selected = images[activeIndex % Math.max(images.length, 1)];
  const displayNumber = number ?? item.number ?? "";
  const move = (direction: -1 | 1) => setActiveIndex((current) => (current + direction + images.length) % images.length);

  return <article className="mp-project-card">
    <div className="mp-project-media" role="group" aria-roledescription="carrossel" aria-label={`Galeria: ${item.title}`}>
      {selected ? <GalleryImage image={selected} /> : <div className="mp-image-placeholder" role="img" aria-label={`Imagem temporária: ${item.title}`}><span>Imagem temporária</span></div>}
      {images.length > 1 && <div className="mp-gallery-controls">
        <button type="button" onClick={() => move(-1)} aria-label={`Imagem anterior: ${item.title}`}>‹</button>
        <span aria-live="polite">{String((activeIndex % images.length) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => move(1)} aria-label={`Próxima imagem: ${item.title}`}>›</button>
      </div>}
    </div>
    <div className="mp-project-copy">
      <div className="mp-project-meta"><span>{displayNumber}</span><p className="mp-eyebrow">{item.category}</p></div>
      <h2><Link href={`/projetos/${item.slug}`}>{item.title}</Link></h2>
      <Link className="mp-project-detail-link" href={`/projetos/${item.slug}`}>VER PROJETO <Arrow /></Link>
    </div>
  </article>;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function useAllProjects(): PortfolioItem[] {
  const { data } = trpc.site.projects.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const dynamicItems = (data ?? []).map((item, index): PortfolioItem => {
    const category = item.category || "PROJETO";
    const corporate = category.toUpperCase().includes("CORPORATIVO");
    return {
      slug: `novo-${slugify(item.title)}-${index + 1}`,
      number: String(base44Projects.length + index + 1).padStart(2, "0"),
      category,
      title: item.title,
      description: "",
      filter: corporate ? "CORPORATIVO" : "ESPECIAIS",
      images: item.url ? [{ src: item.url, alt: item.title }] : [],
    };
  });
  return [...base44Projects, ...dynamicItems];
}

function PortfolioGrid({ scope = "all", showFilters = false }: { scope?: "all" | "residential" | "corporate"; showFilters?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("TODOS");
  const items = useAllProjects();
  const visible = useMemo(() => items.filter((item) => {
    if (scope === "corporate" && item.filter !== "CORPORATIVO") return false;
    if (scope === "residential" && item.filter === "CORPORATIVO") return false;
    return activeFilter === "TODOS" || item.filter === activeFilter;
  }), [items, scope, activeFilter]);
  const filters = projectFilters.filter((item) => scope === "all" || (scope === "corporate" ? item === "TODOS" || item === "CORPORATIVO" : item !== "CORPORATIVO"));

  return <>
    {showFilters && <div className="mp-project-filters" role="group" aria-label="Filtrar projetos por ambiente">
      {filters.map((filter) => {
        const count = projectGroups.find((group) => group.id === filter)?.sourceCount;
        return <button key={filter} type="button" className={activeFilter === filter ? "is-active" : ""} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} title={count}><span>{filter}</span>{count && <small>{count}</small>}</button>;
      })}
    </div>}
    <div className="mp-project-grid">{visible.map((item, index) => <ProjectCard key={`${item.slug}-${index}`} item={item} number={item.number} />)}</div>
    {visible.length === 0 && <p className="mp-empty-projects">Nenhum projeto nesta categoria.</p>}
  </>;
}

function ClosingCallout({ title = "Vamos conversar sobre seu próximo projeto?", text }: { title?: string; text?: string }) {
  return <section className="mp-closing">
    <p className="mp-eyebrow">MADEPRIMER · PLANEJADOS DE INTERIORES</p>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
    <Link href="/contato" className="mp-button">FALAR COM A MADEPRIMER <Arrow /></Link>
  </section>;
}

function PartnerNames() {
  const { data } = trpc.site.partners.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const names = (data ?? []).map((partner) => partner.title).filter(Boolean);
  if (names.length === 0) return null;
  return <div className="mp-partner-list">{names.map((name, index) => <span key={`${name}-${index}`}>{name}</span>)}</div>;
}

export function HomePage() {
  return <>
    <section className="mp-hero">
      <img className="mp-hero-image" src={heroImage.src} alt={heroImage.alt} fetchPriority="high" />
      <div className="mp-hero-rule" aria-hidden="true" />
      <div className="mp-hero-content">
        <p className="mp-eyebrow">MADEPRIMER · PLANEJADOS DE INTERIORES</p>
        <h1>O toque fino da<br /><em>marcenaria premium.</em></h1>
        <Link href="/projetos" className="mp-button">CONHEÇA NOSSOS PROJETOS <Arrow /></Link>
      </div>
    </section>
    <section className="mp-manifesto"><p className="mp-eyebrow">MANIFESTO</p><h2>O luxo está nos detalhes.</h2><p>MadePrimer · Planejados de Interiores. Nosso portfólio reúne cozinhas, dormitórios, salas, bancadas, áreas gourmet e marcenaria corporativa. Conheça os projetos e os detalhes de cada ambiente.</p></section>
    <section className="mp-section" id="projetos">
      <div className="mp-section-heading"><div><p className="mp-eyebrow">PORTFÓLIO</p><h2>Projetos</h2></div><Link href="/projetos" className="mp-text-link">VER TODOS <Arrow /></Link></div>
      <div className="mp-project-grid">{portfolioItems.map((item, index) => <ProjectCard key={item.slug} item={item} number={String(index + 1).padStart(2, "0")} />)}</div>
    </section>
    <section className="mp-feature-section mp-feature-residential"><div className="mp-feature-copy"><p className="mp-eyebrow">RESIDENCIAL</p><h2>Para viver bem, cada detalhe precisa fazer sentido.</h2><p>{residentialDescription}</p><Link href="/ambientes-residenciais" className="mp-text-link">VER PROJETOS RESIDENCIAIS <Arrow /></Link></div><div className="mp-feature-projects mp-feature-single"><GalleryImage image={residentialFeatureImage} /></div></section>
    <section className="mp-feature-section mp-feature-corporate"><div className="mp-feature-copy"><p className="mp-eyebrow">CORPORATIVO</p><h2>Ambientes também comunicam marcas.</h2><p>{corporateDescription}</p><p className="mp-tags">ÁREAS DE TRABALHO · DIVISÓRIAS RIPADAS · MARCENARIA CORPORATIVA</p><Link href="/ambientes-corporativos" className="mp-text-link">CONHEÇA O CORPORATIVO <Arrow /></Link></div><div className="mp-feature-projects"><PortfolioGrid scope="corporate" /></div></section>
    <section className="mp-architect-callout"><p className="mp-eyebrow">PARA ARQUITETOS E DESIGNERS</p><h2>Você cria o projeto.<br /><em>A gente ajuda a fazê-lo acontecer.</em></h2><Link href="/arquitetos" className="mp-text-link">COMO FUNCIONA A PARCERIA <Arrow /></Link></section>
    <section className="mp-section mp-process"><div className="mp-section-heading"><div><p className="mp-eyebrow">PROCESSO</p><h2>PROCESSO</h2></div><Link href="/processo" className="mp-text-link">CONHEÇA O PROCESSO <Arrow /></Link></div><ol className="mp-process-list">{processSteps.map((step, index) => <li key={step}><span className="mp-step-number">0{index + 1}</span><h3>{step}</h3></li>)}</ol></section>
    <section className="mp-section mp-partners-section"><div className="mp-section-heading"><div><p className="mp-eyebrow">PARCEIROS</p><h2>Um bom projeto é feito de boas escolhas.</h2></div><Link href="/parceiros" className="mp-text-link">NOSSOS PARCEIROS <Arrow /></Link></div><PartnerNames /><p className="mp-partner-description">{partnerDescription}</p></section>
    <ClosingCallout />
  </>;
}

export function PortfolioPage() {
  return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="PORTFÓLIO" title="Projetos">{portfolioPageDescription}</SectionIntro><PortfolioGrid showFilters /><ClosingCallout title="Quer um projeto como estes?" text={portfolioCtaDescription} /></section>;
}

export function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const settings = trpc.site.publicSettings.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const primaryPhone = settings.data?.phonePrimary || contactDefaults.phonePrimary;
  const whatsappNumber = primaryPhone.replace(/\D/g, "").replace(/^55/, "");
  const project = base44Projects.find((item) => item.slug === params.slug);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!project) return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="PORTFÓLIO" title="Projeto não encontrado" /><Link className="mp-button" href="/projetos">VOLTAR A PROJETOS <Arrow /></Link></section>;
  const image = project.images[activeIndex % project.images.length];
  const move = (direction: -1 | 1) => setActiveIndex((current) => (current + direction + project.images.length) % project.images.length);
  const quoteText = `Olá! Vim pelo site e me inspirei no projeto "${project.title}". Gostaria de discutir um projeto semelhante para meu ambiente.`;
  const whatsappHref = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(quoteText)}`;
  return <section className="mp-section mp-inner-page mp-project-detail">
    <Link className="mp-back-link" href="/projetos">← VOLTAR A PROJETOS</Link>
    <SectionIntro eyebrow={project.category.toUpperCase()} title={project.title}>{project.description || undefined}</SectionIntro>
    <div className="mp-project-facts"><p className="mp-eyebrow">FICHA TÉCNICA</p><span>CATEGORIA</span><strong>{project.category}</strong></div>
    <div className="mp-detail-gallery">
      {image && <GalleryImage image={image} className="mp-detail-image" loading="eager" />}
      {project.images.length > 1 && <div className="mp-detail-gallery-controls"><button type="button" onClick={() => move(-1)} aria-label="Imagem anterior">← ANTERIOR</button><span aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}</span><button type="button" onClick={() => move(1)} aria-label="Próxima imagem">PRÓXIMA →</button></div>}
      <div className="mp-detail-thumbnails">{project.images.map((photo, index) => <button key={photo.src} type="button" aria-label={`Ver imagem ${index + 1}`} aria-pressed={activeIndex === index} onClick={() => setActiveIndex(index)}>{photo.unavailable ? <span>Imagem indisponível</span> : <img src={photo.src} alt="" loading="lazy" />}</button>)}</div>
    </div>
    <div className="mp-project-actions"><a href={whatsappHref} className="mp-button" target="_blank" rel="noreferrer">SOLICITAR PROJETO SEMELHANTE <Arrow /></a><Link href="/orcamento" className="mp-text-link">PEDIR ORÇAMENTO DETALHADO</Link></div>
    <section className="mp-closing"><p className="mp-eyebrow">MADEPRIMER · PLANEJADOS DE INTERIORES</p><h2>Quer um projeto como este?</h2><p>{projectDetailCtaDescription}</p><Link href="/orcamento" className="mp-button">INICIAR MEU PROJETO <Arrow /></Link></section>
  </section>;
}

export function ResidentialPage() {
  return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="RESIDENCIAL" title="Para viver bem, cada detalhe precisa fazer sentido.">{residentialPageDescription}</SectionIntro><PortfolioGrid scope="residential" showFilters /></section>;
}

export function CorporatePage() {
  return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="CORPORATIVO" title="Ambientes também comunicam marcas.">{corporatePageDescription}</SectionIntro><PortfolioGrid scope="corporate" showFilters /></section>;
}

export function ArchitectsPage() {
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="PARA ARQUITETOS E DESIGNERS" title={<>Você cria o projeto.<br /><em>A gente ajuda a fazê-lo acontecer.</em></>} /><p className="mp-lead">Você cria o projeto. A gente ajuda a fazê-lo acontecer.</p><Link href="/contato" className="mp-button">COMO FUNCIONA A PARCERIA <Arrow /></Link><ClosingCallout /></section>;
}

export function ProcessPage() {
  return <section className="mp-section mp-inner-page"><SectionIntro eyebrow="PROCESSO" title="PROCESSO" /><ol className="mp-process-list">{processSteps.map((step, index) => <li key={step}><span className="mp-step-number">0{index + 1}</span><h2>{step}</h2></li>)}</ol><Link href="/orcamento" className="mp-button">CONHEÇA O PROCESSO <Arrow /></Link></section>;
}

export function PartnersPage() {
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="PARCEIROS" title="Um bom projeto é feito de boas escolhas." /><PartnerNames /><p className="mp-partner-description">{partnerDescription}</p><Link href="/contato" className="mp-text-link">NOSSOS PARCEIROS <Arrow /></Link><ClosingCallout /></section>;
}

export function AboutPage() {
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="SOBRE" title="MADEPRIMER · PLANEJADOS DE INTERIORES" /><p className="mp-lead">MadePrimer · Planejados de Interiores.</p><p className="mp-lead">Nosso portfólio reúne cozinhas, dormitórios, salas, bancadas, áreas gourmet e marcenaria corporativa. Conheça os projetos e os detalhes de cada ambiente.</p><ClosingCallout /></section>;
}

export function ContactPage() {
  const { data } = trpc.site.publicSettings.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const phone = data?.phonePrimary || contactDefaults.phonePrimary;
  const secondary = data?.phoneSecondary || contactDefaults.phoneSecondary;
  const digits = phone.replace(/\D/g, "");
  const secondaryDigits = secondary.replace(/\D/g, "");
  const internationalSecondary = secondaryDigits.startsWith("55") ? secondaryDigits : `55${secondaryDigits}`;
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="CONTATO" title="Vamos conversar sobre seu próximo projeto?" /><div className="mp-contact-details"><a href={`https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`}>{phone}</a><a href={`tel:+${internationalSecondary}`}>{secondary}</a><address>{data?.address || contactDefaults.address}<br />Jandira — SP</address></div><Link href="/orcamento" className="mp-button">SOLICITAR ORÇAMENTO <Arrow /></Link></section>;
}

export function MyAccountPage() {
  return <section className="mp-section mp-inner-page mp-editorial-page"><SectionIntro eyebrow="MINHA CONTA" title="MINHA CONTA" /><div className="mp-info-panel"><p>O acesso à conta de cliente não está habilitado nesta versão.</p><Link href="/orcamento" className="mp-text-link">SOLICITAR ORÇAMENTO <Arrow /></Link></div></section>;
}

export function PrivacyPage() {
  const { data } = trpc.site.publicSettings.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const primaryPhone = data?.phonePrimary || contactDefaults.phonePrimary;
  const secondaryPhone = data?.phoneSecondary || contactDefaults.phoneSecondary;
  return <section className="mp-section mp-inner-page mp-privacy"><SectionIntro eyebrow="INFORMAÇÕES" title="Política de privacidade" /><p className="mp-review-note">Rascunho para revisão jurídica antes da publicação.</p><h2>Dados enviados pelo formulário</h2><p>Ao solicitar um orçamento, você pode informar nome, telefone, e-mail, cidade, ambiente, objetivo, medidas aproximadas, prazo, faixa de investimento e anexar imagens ou PDFs de referência. O aceite da política é solicitado antes do envio.</p><h2>Uso e armazenamento</h2><p>Essas informações são armazenadas no banco de dados do site MadePrimer e são usadas para receber, analisar e acompanhar a solicitação. Os anexos são armazenados em área privada e podem ser acessados somente por administradores autorizados da MadePrimer. Nesta versão não há envio da solicitação para CRM, e-mail de terceiros, campanhas de publicidade ou serviços de inteligência artificial.</p><h2>Contato e revisão</h2><p>Para falar sobre uma solicitação, use os contatos publicados nesta página. Os prazos de retenção, procedimentos de exclusão e demais informações legais devem ser revisados e complementados pela MadePrimer antes de qualquer publicação oficial.</p><p className="mp-privacy-contact">{primaryPhone} · {secondaryPhone}</p></section>;
}
