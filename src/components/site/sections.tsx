import { Link } from "@tanstack/react-router";
import { Placeholder, SectionTitle, btn } from "./ui";

export const steps = [
  { n: "01", t: "Conversa inicial", d: "Entendemos o espaço, a rotina e o objetivo do projeto." },
  { n: "02", t: "Medição e projeto", d: "Levantamento técnico e desenvolvimento do mobiliário sob medida." },
  { n: "03", t: "Proposta", d: "Materiais, acabamentos, prazos e investimento apresentados com clareza." },
  { n: "04", t: "Produção", d: "Fabricação dos módulos conforme o projeto aprovado." },
  { n: "05", t: "Instalação", d: "Montagem no local e entrega do ambiente pronto." },
];

export function Segments() {
  return (
    <section className="container-site py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-8">
        {[
          { to: "/casa" as const, k: "Casa", t: "Seu espaço. Seu jeito de viver.", d: "Cozinhas, dormitórios, salas e closets pensados para a rotina de quem mora." },
          { to: "/business" as const, k: "Business", t: "Ambientes que representam negócios.", d: "Escritórios, lojas, recepções e espaços comerciais com identidade e função." },
        ].map((s) => (
          <Link key={s.to} to={s.to} className="group block">
            <Placeholder label={s.k} ratio="aspect-[4/3]" className="transition-opacity group-hover:opacity-90" />
            <p className="eyebrow mt-6">{s.k}</p>
            <h3 className="mt-3 text-3xl md:text-4xl">{s.t}</h3>
            <p className="mt-3 max-w-md text-muted-foreground">{s.d}</p>
            <span className="mt-5 inline-block text-sm font-semibold underline-offset-4 group-hover:underline">Conhecer →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export const gallery = [
  { label: "Cozinha", cat: "Casa", r: "aspect-[4/5]" },
  { label: "Recepção", cat: "Business", r: "aspect-[4/3]" },
  { label: "Closet", cat: "Casa", r: "aspect-[4/3]" },
  { label: "Sala de estar", cat: "Casa", r: "aspect-[4/5]" },
  { label: "Escritório", cat: "Business", r: "aspect-[4/5]" },
  { label: "Loja", cat: "Business", r: "aspect-[4/3]" },
];

export function PortfolioPreview() {
  return (
    <section className="container-site py-20 md:py-28">
      <SectionTitle eyebrow="Portfólio" title="Ambientes em destaque">
        Galeria provisória. As fotos oficiais de projetos serão publicadas em breve.
      </SectionTitle>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {gallery.slice(0, 3).map((g, i) => (
          <Placeholder key={g.label} label={g.label} ratio={i === 0 ? "aspect-[3/4]" : "aspect-[3/4]"} className={i === 0 ? "col-span-2 md:col-span-1" : ""} />
        ))}
      </div>
      <Link to="/portfolio" className={btn("outline", "mt-10")}>Ver portfólio</Link>
    </section>
  );
}

export function ProcessList() {
  return (
    <ol className="mt-12 grid gap-px border bg-border md:grid-cols-5">
      {steps.map((s) => (
        <li key={s.n} className="bg-card p-6">
          <span className="font-display text-3xl italic text-wood">{s.n}</span>
          <h3 className="mt-6 text-xl">{s.t}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

export function PartnersBlock() {
  return (
    <section className="container-site grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
      <Placeholder label="Detalhe de execução" ratio="aspect-square" />
      <div>
        <p className="eyebrow">Parceiros arquitetos</p>
        <h2 className="mt-4 text-4xl leading-tight md:text-5xl">Você projeta. A MadePrimer executa.</h2>
        <p className="mt-5 max-w-md text-muted-foreground leading-relaxed">
          Trabalhamos lado a lado com arquitetos e designers de interiores para levar o detalhamento do papel ao ambiente.
        </p>
        <Link to="/parceiros" className={btn("outline", "mt-8")}>Seja parceiro</Link>
      </div>
    </section>
  );
}

export function ContactBlock() {
  return (
    <section className="container-site py-20 md:py-28">
      <SectionTitle eyebrow="Contato" title="Fale com a MadePrimer">
        Os canais oficiais (WhatsApp, e-mail e endereço) serão adicionados em breve. Enquanto isso, use o formulário de orçamento.
      </SectionTitle>
      <div className="mt-10 flex flex-wrap gap-4 md:pl-[25%]">
        <Link to="/orcamento" className={btn("primary")}>Solicitar orçamento</Link>
        <Link to="/contato" className={btn("outline")}>Página de contato</Link>
      </div>
    </section>
  );
}
