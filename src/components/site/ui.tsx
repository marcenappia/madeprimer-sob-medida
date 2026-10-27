import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light";
const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-foreground",
  outline: "border border-foreground/80 text-foreground hover:bg-foreground hover:text-background",
  ghost: "text-foreground underline-offset-4 hover:underline px-0",
  light: "bg-background text-foreground hover:bg-card",
};
export const btn = (v: Variant = "primary", extra?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none",
    variants[v],
    extra,
  );

export function Placeholder({ label, ratio = "aspect-[4/5]", className }: { label: string; ratio?: string; className?: string }) {
  return (
    <div role="img" aria-label={`Imagem temporária: ${label}`} className={cn("placeholder-pattern relative overflow-hidden", ratio, className)}>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <span className="font-display text-lg italic text-foreground/80">{label}</span>
        <span className="rounded-sm bg-card/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Imagem temporária
        </span>
      </div>
    </div>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="container-site pt-16 pb-12 md:pt-28 md:pb-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] md:text-7xl">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}
    </section>
  );
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="grid gap-6 border-t pt-8 md:grid-cols-12">
      <p className="eyebrow md:col-span-3">{eyebrow}</p>
      <div className="md:col-span-9">
        <h2 className="text-3xl leading-tight md:text-5xl">{title}</h2>
        {children && <div className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-forest text-primary-foreground">
      <div className="container-site flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <h2 className="max-w-2xl text-4xl leading-tight md:text-6xl">Vamos desenhar o seu próximo ambiente?</h2>
        <Link to="/orcamento" className={btn("light")}>Solicitar orçamento →</Link>
      </div>
    </section>
  );
}

export const seo = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
