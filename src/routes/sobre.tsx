import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, Placeholder, seo } from "@/components/site/ui";

export const Route = createFileRoute("/sobre")({
  head: () => seo("Sobre — MadePrimer", "Conheça a MadePrimer, marcenaria sob medida para casa e negócios."),
  component: () => (
    <>
      <PageHero eyebrow="Sobre" title="Precisão, cuidado e mobiliário feito para durar." />
      <section className="container-site grid gap-10 pb-24 md:grid-cols-2">
        <Placeholder label="Oficina" ratio="aspect-[4/3]" />
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>A MadePrimer desenvolve marcenaria sob medida para residências, negócios e parceiros arquitetos.</p>
          <p className="border-l-2 border-wood pl-4 text-sm">Conteúdo provisório — a história e os dados oficiais da empresa serão adicionados em breve.</p>
        </div>
      </section>
      <CtaBand />
    </>
  ),
});
