export const siteNavigation = [
  { label: "PROJETOS", href: "/projetos" },
  { label: "RESIDENCIAL", href: "/ambientes-residenciais" },
  { label: "CORPORATIVO", href: "/ambientes-corporativos" },
  { label: "ARQUITETOS", href: "/arquitetos" },
  { label: "PROCESSO", href: "/processo" },
  { label: "PARCEIROS", href: "/parceiros" },
  { label: "SOBRE", href: "/sobre" },
  { label: "CONTATO", href: "/contato" },
  { label: "MINHA CONTA", href: "/meus-orcamentos" },
  { label: "SOLICITAR ORÇAMENTO", href: "/orcamento" },
] as const;

export const footerNavigation = [
  { label: "Projetos", href: "/projetos" },
  { label: "Residencial", href: "/ambientes-residenciais" },
  { label: "Corporativo", href: "/ambientes-corporativos" },
  { label: "Arquitetos e designers", href: "/arquitetos" },
  { label: "Processo", href: "/processo" },
  { label: "Parceiros", href: "/parceiros" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;

export type ProjectImage = {
  src: string;
  alt: string;
  unavailable?: boolean;
};

export type Base44Project = {
  slug: string;
  title: string;
  category: string;
  filter: "COZINHAS" | "DORMITÓRIOS" | "SALAS" | "GOURMET" | "BANHEIROS" | "CORPORATIVO" | "ESPECIAIS";
  description: string;
  images: ProjectImage[];
};

export type PortfolioItem = Base44Project & { number?: string };

function gallery(prefix: string, title: string, count: number, extension = "jpg", firstUnavailable = false): ProjectImage[] {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const unavailable = firstUnavailable && index === 0;
    const fileExtension = unavailable ? "png" : extension;
    return {
      src: `/assets/base44/${prefix}-${number}.${fileExtension}`,
      alt: unavailable ? `${title} — imagem indisponível na referência Base44` : `${title} — foto ${index + 1}`,
      ...(unavailable ? { unavailable: true } : {}),
    };
  });
}

export const base44Projects: Base44Project[] = [
  {
    slug: "cozinha-armarios-amadeirados",
    title: "Cozinha com armários amadeirados",
    category: "Cozinhas Planejadas",
    filter: "COZINHAS",
    description: "Cozinha planejada com armários em acabamento amadeirado, bancada e espaço para os eletrodomésticos. O portfólio apresenta diferentes vistas da composição.",
    images: gallery("kitchen", "Cozinha com armários amadeirados", 4),
  },
  {
    slug: "cozinha-planejada-ilha",
    title: "Cozinha planejada com ilha",
    category: "Cozinhas Planejadas",
    filter: "COZINHAS",
    description: "Cozinha com ilha, armários e espaço para refrigerador. O projeto apresenta a disposição do mobiliário e a integração da bancada com o ambiente.",
    images: [{ src: "/assets/base44/residential-kitchen-island.jpg", alt: "Cozinha planejada com ilha" }],
  },
  {
    slug: "dormitorio-bancada-espelho",
    title: "Dormitório com bancada e espelho",
    category: "Closets e Dormitórios",
    filter: "DORMITÓRIOS",
    description: "Projeto de dormitório com cama, bancada, espelho e prateleiras. A marcenaria reúne o espaço de descanso e uma área de apoio para a rotina.",
    images: gallery("bedroom", "Dormitório com bancada e espelho", 3),
  },
  {
    slug: "sala-estante-cristaleira",
    title: "Sala com estante e cristaleira",
    category: "Salas e Painéis de TV",
    filter: "SALAS",
    description: "Marcenaria para sala com estante e cristaleira. A galeria apresenta as composições do mobiliário e os detalhes da área de exposição e armazenamento.",
    images: gallery("living", "Sala com estante e cristaleira", 7),
  },
  {
    slug: "ambiente-integrado-painel-ripado",
    title: "Ambiente integrado com painel ripado",
    category: "Salas e Painéis de TV",
    filter: "SALAS",
    description: "Ambiente integrado com sala planejada, painel ripado e cruz. A galeria também apresenta a cozinha, os armários e a área de convivência do projeto.",
    images: gallery("integrated", "Ambiente integrado com painel ripado", 25, "jpg", true),
  },
  {
    slug: "area-gourmet-forno-tijolos",
    title: "Área gourmet com forno de tijolos",
    category: "Espaços Gourmet",
    filter: "GOURMET",
    description: "Ambiente gourmet com armários claros e forno de tijolos. A composição reúne marcenaria e área de preparo em um mesmo espaço.",
    images: gallery("gourmet", "Área gourmet com forno de tijolos", 1),
  },
  {
    slug: "banheiro-casal",
    title: "Banheiro do casal",
    category: "Banheiros",
    filter: "BANHEIROS",
    description: "Projeto de banheiro do casal apresentado nos materiais da MadePrimer. A galeria reúne as imagens da proposta de marcenaria para o ambiente.",
    images: gallery("bathroom", "Banheiro do casal", 4, "png"),
  },
  {
    slug: "divisorias-marcenaria-corporativa",
    title: "Divisórias e marcenaria corporativa",
    category: "Corporativo",
    filter: "CORPORATIVO",
    description: "Ambiente profissional com divisórias ripadas, áreas de trabalho e marcenaria integrada. As imagens apresentam diferentes vistas da composição dos espaços.",
    images: gallery("corporate", "Divisórias e marcenaria corporativa", 3),
  },
  {
    slug: "bancadas-sob-medida",
    title: "Bancadas sob medida",
    category: "Projetos Especiais",
    filter: "ESPECIAIS",
    description: "Marcenaria especializada em bancadas. A galeria apresenta composições de bancadas e mobiliário para cozinhas do portfólio MadePrimer.",
    images: gallery("special", "Bancadas sob medida", 6, "png"),
  },
];

export const portfolioItems: PortfolioItem[] = [
  { ...base44Projects[0], number: "01", filter: "COZINHAS" },
  { ...base44Projects[3], number: "02", filter: "SALAS" },
  { ...base44Projects[2], number: "03", filter: "DORMITÓRIOS" },
  { ...base44Projects[7], number: "04", filter: "CORPORATIVO" },
  { ...base44Projects[8], number: "05", filter: "ESPECIAIS" },
];

export const projectGroups = [
  { id: "COZINHAS", title: "COZINHAS PLANEJADAS", sourceCount: "5 fotos · 2 projetos" },
  { id: "DORMITÓRIOS", title: "CLOSETS E DORMITÓRIOS", sourceCount: "3 fotos · 1 projeto" },
  { id: "SALAS", title: "SALAS E PAINÉIS DE TV", sourceCount: "32 fotos · 2 projetos" },
  { id: "GOURMET", title: "ESPAÇOS GOURMET", sourceCount: "1 foto · 1 projeto" },
  { id: "BANHEIROS", title: "BANHEIROS", sourceCount: "4 fotos · 1 projeto" },
  { id: "CORPORATIVO", title: "CORPORATIVO", sourceCount: "3 fotos · 1 projeto" },
  { id: "ESPECIAIS", title: "PROJETOS ESPECIAIS", sourceCount: "6 fotos · 1 projeto" },
] as const;

export const projectFilters = ["TODOS", "COZINHAS", "DORMITÓRIOS", "SALAS", "GOURMET", "BANHEIROS", "CORPORATIVO", "ESPECIAIS"] as const;

export const heroImage = {
  src: "/assets/base44/kitchen-01.jpg",
  alt: "Cozinha com armários amadeirados",
};

export const residentialFeatureImage = {
  src: "/assets/base44/residential-kitchen-island.jpg",
  alt: "Cozinha planejada com ilha",
};

export const heroEyebrow = "MADEPRIMER · PLANEJADOS DE INTERIORES";
export const heroTitle = "O toque fino da marcenaria premium.";
export const companyDescription = "MadePrimer · Planejados de Interiores. Nosso portfólio reúne cozinhas, dormitórios, salas, bancadas, áreas gourmet e marcenaria corporativa. Conheça os projetos e os detalhes de cada ambiente.";
export const footerDescription = "MadePrimer · Planejados de Interiores. Nosso portfólio reúne cozinhas, dormitórios, salas com estantes e cristaleiras, bancadas, áreas gourmet e marcenaria corporativa.";
export const residentialDescription = "Conheça nossas cozinhas planejadas, dormitórios com bancadas e espelhos, salas com estantes e cristaleiras, painéis ripados e áreas gourmet.";
export const residentialPageDescription = "Conheça os projetos do nosso portfólio: cozinhas, dormitórios com bancadas e espelhos, salas com estantes e cristaleiras, ambientes gourmet e banheiros.";
export const corporateDescription = "Nosso portfólio corporativo apresenta divisórias ripadas e marcenaria integrada a áreas de trabalho, com diferentes vistas e detalhes dos ambientes.";
export const corporatePageDescription = "Divisórias ripadas, áreas de trabalho e marcenaria integrada: conheça os ambientes profissionais apresentados no portfólio MadePrimer.";
export const portfolioPageDescription = "Conheça o portfólio MadePrimer: projetos residenciais e corporativos, com imagens e detalhes de cada ambiente.";
export const partnerDescription = "Trabalhamos com parceiros e fornecedores selecionados para ampliar as possibilidades de cada projeto.";
export const projectDetailCtaDescription = "Adaptamos este conceito ao seu espaço, estilo e orçamento.";
export const portfolioCtaDescription = "Adaptamos qualquer conceito ao seu espaço, estilo e necessidade.";
export const processSteps = ["PROJETO", "ANÁLISE", "ORÇAMENTO", "PRODUÇÃO", "INSTALAÇÃO"] as const;
export const contactDefaults = {
  phonePrimary: "(11) 97975-6780",
  phoneSecondary: "(11) 98865-3576",
  address: "Rua Diadema, 10",
  city: "Jandira — SP",
};

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/madeprimer/" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61575217067446" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/madeprimer-m%C3%B3veis-sob-medida/" },
  { label: "YouTube", href: "https://www.youtube.com/@M%C3%B3veisPlanejadosMadePrimer" },
  { label: "Pinterest", href: "https://br.pinterest.com/madeprimer/" },
] as const;
