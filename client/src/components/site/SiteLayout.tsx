import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { contactDefaults, footerNavigation, footerDescription, siteNavigation, socialLinks } from "./content";

function phoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (!digits.startsWith("55")) digits = `55${digits.replace(/^0+/, "")}`;
  return digits;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const settings = trpc.site.publicSettings.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const primaryPhone = settings.data?.phonePrimary || contactDefaults.phonePrimary;
  const secondaryPhone = settings.data?.phoneSecondary || contactDefaults.phoneSecondary;
  const address = settings.data?.address || contactDefaults.address;
  return <div className="mp-site">
    <a className="mp-skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="mp-header">
      <div className="mp-header-inner">
        <Link href="/" aria-label="MadePrimer — página inicial" className="mp-brand" onClick={() => setMenuOpen(false)}>
          <img className="mp-brand-logo" src="/assets/logo-madeprimer.png" alt="MadePrimer · Planejados de Interiores" />
        </Link>
        <button className="mp-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mp-navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "FECHAR" : "MENU"}</button>
        <nav id="mp-navigation" className={`mp-nav${menuOpen ? " mp-nav-open" : ""}`} aria-label="Navegação principal">
          {siteNavigation.map((item) => <Link key={item.href} href={item.href} className={item.label === "SOLICITAR ORÇAMENTO" ? "mp-nav-cta" : "mp-nav-link"} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
        </nav>
      </div>
    </header>
    <main id="conteudo" className="mp-main">{children}</main>
    <footer className="mp-footer">
      <div className="mp-footer-grid">
        <section className="mp-footer-about">
          <Link href="/" aria-label="MadePrimer — início" className="mp-footer-brand">MadePrimer</Link>
          <p>{footerDescription}</p>
          <a className="mp-footer-whatsapp" href={`https://wa.me/${phoneDigits(primaryPhone)}`} target="_blank" rel="noreferrer">FALAR NO WHATSAPP ↗</a>
        </section>
        <section><h2>NAVEGAÇÃO</h2><ul className="mp-footer-list">{footerNavigation.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></section>
        <section><h2>CONTATO</h2><address className="mp-contact-list"><a href={`https://wa.me/${phoneDigits(primaryPhone)}`}>{primaryPhone}</a><a href={`tel:+${phoneDigits(secondaryPhone)}`}>{secondaryPhone}</a><span>{address}</span><span>{contactDefaults.city}</span></address></section>
        <section><h2>REDES</h2><ul className="mp-footer-list mp-social-list">{socialLinks.map((social) => <li key={social.label}>{social.href ? <a href={social.href} target="_blank" rel="noreferrer">{social.label}</a> : <span>{social.label}</span>}</li>)}</ul></section>
      </div>
      <div className="mp-footer-bottom"><span>© 2026 MadePrimer Móveis sob medida. Todos os direitos reservados.</span><Link href="/privacidade">Política de privacidade</Link><Link href="/admin">Painel administrativo</Link></div>
    </footer>
  </div>;
}
