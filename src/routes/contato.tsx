import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, btn, seo } from "@/components/site/ui";

export const Route = createFileRoute("/contato")({
  head: () => seo("Contato — MadePrimer", "Entre em contato com a MadePrimer."),
  component: () => (
    <>
      <PageHero eyebrow="Contato" title="Fale com a MadePrimer." />
      <section className="container-site grid gap-px border bg-border pb-0 md:grid-cols-3">
        {["WhatsApp", "E-mail", "Endereço"].map((c) => (
          <div key={c} className="bg-card p-8">
            <p className="eyebrow">{c}</p>
            <p className="mt-4 font-display text-2xl text-muted-foreground">Em breve</p>
          </div>
        ))}
      </section>
      <section className="container-site py-16">
        <Link to="/orcamento" className={btn("primary")}>Solicitar orçamento</Link>
      </section>
    </>
  ),
});
