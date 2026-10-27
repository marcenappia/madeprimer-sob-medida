import { createFileRoute } from "@tanstack/react-router";
import { PageHero, seo } from "@/components/site/ui";
import { QuoteForm } from "@/components/site/QuoteForm";

export const Route = createFileRoute("/orcamento")({
  head: () => seo("Solicitar orçamento — MadePrimer", "Peça um orçamento de marcenaria sob medida em três etapas."),
  component: () => (
    <>
      <PageHero eyebrow="Orçamento" title="Conte sobre o seu projeto." intro="Três etapas rápidas. Leva poucos minutos." />
      <section className="container-site max-w-3xl pb-24"><QuoteForm /></section>
    </>
  ),
});
