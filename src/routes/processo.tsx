import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, seo } from "@/components/site/ui";
import { ProcessList } from "@/components/site/sections";

export const Route = createFileRoute("/processo")({
  head: () => seo("Processo — MadePrimer", "Como trabalhamos: da conversa inicial à instalação do mobiliário sob medida."),
  component: () => (
    <>
      <PageHero eyebrow="Processo" title="Do projeto à execução, com clareza em cada etapa." />
      <section className="container-site pb-24"><ProcessList /></section>
      <CtaBand />
    </>
  ),
});
