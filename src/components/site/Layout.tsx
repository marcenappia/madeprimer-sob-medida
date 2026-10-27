import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { btn } from "./ui";

const nav = [
  { to: "/casa", label: "Casa" },
  { to: "/business", label: "Business" },
  { to: "/portfolio", label: "Portfólio" },
  { to: "/processo", label: "Processo" },
  { to: "/parceiros", label: "Parceiros" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="font-display text-2xl tracking-tight" onClick={() => setOpen(false)}>
          Made<span className="italic text-wood">Primer</span>
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/orcamento" className={btn("primary", "hidden sm:inline-flex py-2.5")}>Solicitar orçamento</Link>
          <button
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-foreground transition-transform ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-foreground transition-transform ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-background lg:hidden animate-in fade-in">
          <nav aria-label="Menu móvel" className="container-site flex flex-col py-6">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="border-b py-4 font-display text-3xl">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="container-site mt-auto pb-8">
            <Link to="/orcamento" onClick={() => setOpen(false)} className={btn("primary", "w-full")}>Solicitar orçamento</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl">Made<span className="italic text-wood">Primer</span></p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Marcenaria sob medida. Do projeto à execução.</p>
        </div>
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-3 text-sm md:col-span-7 md:grid-cols-3">
          {[...nav, { to: "/orcamento", label: "Orçamento" }, { to: "/privacidade", label: "Privacidade" }].map((n) => (
            <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-foreground">{n.label}</Link>
          ))}
        </nav>
      </div>
      <div className="container-site border-t py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} MadePrimer · Versão de demonstração
      </div>
    </footer>
  );
}
