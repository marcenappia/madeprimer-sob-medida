import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, Placeholder, seo } from "@/components/site/ui";

export const Route = createFileRoute("/business")({
  head: () => seo("Business — MadePrimer", "Marcenaria sob medida para escritórios, lojas, recepções e espaços comerciais."),
  component: () => (
    <>
      <PageHero eyebrow="Business" title="Ambientes que representam negócios." intro="Mobiliário corporativo e comercial que traduz a identidade da marca e funciona no uso intenso do dia a dia." />
      <section className="container-site grid gap-x-5 gap-y-12 pb-24 sm:grid-cols-2">
        {([["Escritórios", "Estações, salas de reunião e armazenamento."], ["Lojas", "Expositores e balcões alinhados à marca."], ["Recepções", "A primeira impressão do seu espaço."], ["Clínicas e consultórios", "Funcionalidade com acolhimento."]] as const).map(([t, d]) => (
          <article key={t}>
            <Placeholder label={t} ratio="aspect-[16/10]" />
            <h2 className="mt-5 text-2xl">{t}</h2>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </article>
        ))}
      </section>
      <CtaBand />
    </>
  ),
});
