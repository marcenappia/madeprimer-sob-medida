import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CtaBand, PageHero, Placeholder, seo } from "@/components/site/ui";
import { gallery } from "@/components/site/sections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portfolio")({
  head: () => seo("Portfólio — MadePrimer", "Galeria de ambientes de marcenaria sob medida para casa e negócios."),
  component: Portfolio,
});

function Portfolio() {
  const [f, setF] = useState("Todos");
  const items = gallery.filter((g) => f === "Todos" || g.cat === f);
  return (
    <>
      <PageHero eyebrow="Portfólio" title="Ambientes" intro="Galeria provisória com imagens temporárias. As fotos oficiais serão publicadas em breve." />
      <section className="container-site pb-24">
        <div role="group" aria-label="Filtrar" className="mb-10 flex gap-2">
          {["Todos", "Casa", "Business"].map((c) => (
            <button key={c} aria-pressed={f === c} onClick={() => setF(c)} className={cn("rounded-full border px-5 py-2 text-sm transition-colors", f === c ? "border-foreground bg-foreground text-background" : "hover:border-foreground")}>{c}</button>
          ))}
        </div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((g) => (
            <figure key={g.label} className="mb-5 break-inside-avoid">
              <Placeholder label={g.label} ratio={g.r} />
              <figcaption className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{g.cat}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
