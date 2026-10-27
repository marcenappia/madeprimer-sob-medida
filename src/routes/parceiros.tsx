import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Placeholder, btn, seo } from "@/components/site/ui";

export const Route = createFileRoute("/parceiros")({
  head: () => seo("Parceiros arquitetos — MadePrimer", "Você projeta. A MadePrimer executa. Marcenaria sob medida para arquitetos e designers."),
  component: () => (
    <>
      <PageHero eyebrow="Parceiros" title="Você projeta. A MadePrimer executa." intro="Uma parceria para arquitetos e designers de interiores que precisam de execução fiel ao projeto." />
      <section className="container-site grid gap-10 pb-24 md:grid-cols-2">
        <Placeholder label="Detalhamento" ratio="aspect-[4/3]" />
        <ul className="divide-y border-y">
          {["Leitura atenta do projeto e do detalhamento", "Comunicação direta durante produção e instalação", "Proposta clara para apresentar ao seu cliente"].map((t) => (
            <li key={t} className="py-5 font-display text-2xl">{t}</li>
          ))}
          <li className="py-6"><Link to="/contato" className={btn("primary")}>Quero ser parceiro</Link></li>
        </ul>
      </section>
    </>
  ),
});
