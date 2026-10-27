import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, Placeholder, seo } from "@/components/site/ui";

export const Route = createFileRoute("/casa")({
  head: () => seo("Casa — MadePrimer", "Marcenaria sob medida para residências: cozinhas, dormitórios, closets e salas."),
  component: () => (
    <>
      <PageHero eyebrow="Casa" title="Seu espaço. Seu jeito de viver." intro="Móveis desenhados a partir da sua rotina, das medidas reais do ambiente e dos materiais que você escolher." />
      <section className="container-site grid gap-x-5 gap-y-12 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {[["Cozinhas", "Organização, ergonomia e acabamentos para o dia a dia."], ["Dormitórios", "Armários e painéis integrados ao espaço."], ["Closets", "Cada peça com seu lugar."], ["Salas e home", "Painéis, estantes e marcenaria de apoio."], ["Banheiros", "Gabinetes sob medida para áreas úmidas."], ["Home office", "Bancadas e nichos para trabalhar bem."]].map(([t, d]) => (
          <article key={t}>
            <Placeholder label={t} ratio="aspect-[4/3]" />
            <h2 className="mt-5 text-2xl">{t}</h2>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </article>
        ))}
      </section>
      <CtaBand />
    </>
  ),
});
