export const siteNavigation = [
  { label: "PROJETOS", href: "/projetos" },
  { label: "RESIDENCIAL", href: "/residencial" },
  { label: "CORPORATIVO", href: "/corporativo" },
  { label: "ARQUITETOS", href: "/arquitetos" },
  { label: "PROCESSO", href: "/processo" },
  { label: "PARCEIROS", href: "/parceiros" },
  { label: "SOBRE", href: "/sobre" },
  { label: "CONTATO", href: "/contato" },
  { label: "MINHA CONTA", href: "/minha-conta" },
  { label: "SOLICITAR ORÇAMENTO", href: "/orcamento" },
] as const;

export const footerNavigation = [
  { label: "Projetos", href: "/projetos" },
  { label: "Residencial", href: "/residencial" },
  { label: "Corporativo", href: "/corporativo" },
  { label: "Arquitetos e designers", href: "/arquitetos" },
  { label: "Processo", href: "/processo" },
  { label: "Parceiros", href: "/parceiros" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;

export type PortfolioItem = {
  number: string;
  category: string;
  title: string;
  image?: string;
  alt?: string;
  temporary: boolean;
};

export const portfolioItems: PortfolioItem[] = [
  { number: "01", category: "COZINHA", title: "Cozinha com armários amadeirados", image: "/assets/cozinha-madeprimer.png", alt: "Cozinha com armários amadeirados", temporary: false },
  { number: "02", category: "LIVING", title: "Sala com estante e cristaleira", temporary: true },
  { number: "03", category: "DORMITÓRIO", title: "Dormitório com bancada e espelho", temporary: true },
  { number: "04", category: "CORPORATIVO", title: "Divisórias e marcenaria corporativa", temporary: true },
  { number: "05", category: "PROJETOS ESPECIAIS", title: "Bancadas sob medida", temporary: true },
];

export const heroEyebrow = "MADEPRIMER · PLANEJADOS DE INTERIORES";
export const heroTitle = "O toque fino da marcenaria premium.";
export const companyDescription = "MadePrimer · Planejados de Interiores. Nosso portfólio reúne cozinhas, dormitórios, salas, bancadas, áreas gourmet e marcenaria corporativa. Conheça os projetos e os detalhes de cada ambiente.";
export const footerDescription = "MadePrimer · Planejados de Interiores. Nosso portfólio reúne cozinhas, dormitórios, salas com estantes e cristaleiras, bancadas, áreas gourmet e marcenaria corporativa.";
export const residentialDescription = "Conheça nossas cozinhas planejadas, dormitórios com bancadas e espelhos, salas com estantes e cristaleiras, painéis ripados e áreas gourmet.";
export const corporateDescription = "Nosso portfólio corporativo apresenta divisórias ripadas e marcenaria integrada a áreas de trabalho, com diferentes vistas e detalhes dos ambientes.";
export const partnerDescription = "Trabalhamos com parceiros e fornecedores selecionados para ampliar as possibilidades de cada projeto.";

export const processSteps = ["PROJETO", "ANÁLISE", "ORÇAMENTO", "PRODUÇÃO", "INSTALAÇÃO"] as const;
export const contactDefaults = {
  phonePrimary: "(11) 97975-6780",
  phoneSecondary: "(11) 98865-3576",
  address: "Rua Diadema, 10",
  city: "Jandira — SP",
};

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/madeprimer/" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61575217067446&locale=pt_BR" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/madeprimer-m%C3%B3veis-sob-medida/" },
  { label: "YouTube", href: null },
  { label: "Pinterest", href: "https://br.pinterest.com/madeprimer" },
] as const;
