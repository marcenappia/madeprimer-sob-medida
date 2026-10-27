export const siteNavigation = [
  { label: "PROJETOS", href: "/projetos" },
  { label: "CASA", href: "/residencial" },
  { label: "BUSINESS", href: "/corporativo" },
  { label: "ARQUITETOS", href: "/arquitetos" },
  { label: "PROCESSO", href: "/processo" },
  { label: "SOBRE", href: "/sobre" },
  { label: "CONTATO", href: "/contato" },
  { label: "SOLICITAR ORÇAMENTO", href: "/orcamento" },
] as const;

export const footerNavigation = [
  { label: "Projetos", href: "/projetos" },
  { label: "CASA · Residencial", href: "/residencial" },
  { label: "BUSINESS · Corporativo", href: "/corporativo" },
  { label: "Arquitetos e designers", href: "/arquitetos" },
  { label: "Processo", href: "/processo" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Solicitar orçamento", href: "/orcamento" },
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
  { number: "04", category: "BUSINESS · CORPORATIVO", title: "Divisórias e marcenaria corporativa", temporary: true },
  { number: "05", category: "PROJETOS ESPECIAIS", title: "Bancadas sob medida", temporary: true },
];

export const heroEyebrow = "MADEPRIMER · PLANEJADOS DE INTERIORES";
export const heroTitle = "Marcenaria sob medida. Do projeto à execução.";
export const companyDescription = "A MadePrimer desenvolve soluções de marcenaria sob medida para ambientes residenciais e corporativos, conectando estética, funcionalidade e atenção aos detalhes. Atendemos a Grande São Paulo e região.";
export const footerDescription = "Marcenaria sob medida para casas e negócios. Conheça os projetos da MadePrimer e converse com nossa equipe sobre seu ambiente na Grande São Paulo e região.";
export const residentialDescription = "Seu espaço. Seu jeito de viver. Desenvolvemos soluções de marcenaria sob medida para cozinhas, dormitórios, closets, salas, banheiros, lavanderias e outros ambientes, considerando as medidas e as necessidades de cada projeto.";
export const corporateDescription = "Ambientes que representam negócios. Avaliamos soluções de marcenaria para recepções, escritórios, salas de reunião e outros espaços comerciais, considerando o projeto e as necessidades de uso.";
export const partnerDescription = "Você projeta. A MadePrimer executa. Uma parceria para aproximar o projeto da execução, alinhando especificações, medidas, materiais e detalhes de fabricação.";

export const processSteps = ["CONVERSA INICIAL", "LEVANTAMENTO", "PROPOSTA E ORÇAMENTO", "FABRICAÇÃO", "INSTALAÇÃO E ENTREGA"] as const;
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
