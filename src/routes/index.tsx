import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, Placeholder, SectionTitle, btn, seo } from "@/components/site/ui";
import { ContactBlock, PartnersBlock, PortfolioPreview, ProcessList, Segments } from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => seo("MadePrimer — Marcenaria sob medida", "Marcenaria sob medida para casa, negócios e parceiros arquitetos. Do projeto à execução."),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="container-site grid gap-10 pt-12 pb-16 md:grid-cols-12 md:pt-24 md:pb-24">
        <div className="md:col-span-7 md:pt-8">
          <p className="eyebrow">Marcenaria · Casa · Business</p>
          <h1 className="mt-6 text-5xl leading-[1.02] md:text-[5.5rem]">
            Marcenaria sob medida. <em className="text-wood">Do projeto à execução.</em>
          </h1>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/orcamento" className={btn("primary")}>Solicitar orçamento</Link>
            <Link to="/portfolio" className={btn("outline")}>Ver portfólio</Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <Placeholder label="Ambiente em destaque" ratio="aspect-[4/5]" />
        </div>
      </section>
      <Segments />
      <PortfolioPreview />
      <section className="container-site py-20 md:py-28">
        <SectionTitle eyebrow="Processo" title="Um caminho claro, etapa por etapa." />
        <ProcessList />
      </section>
      <PartnersBlock />
      <CtaBand />
      <ContactBlock />
    </>
  );
}
