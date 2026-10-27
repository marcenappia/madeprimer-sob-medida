# 01 — Auditoria UX e arquitetura da informação

## Objetivo do site
Transformar visitas em conversas comerciais qualificadas, mostrando o que a MadePrimer faz, para quem trabalha, como é o processo e como iniciar um orçamento. O site deve transmitir uma marcenaria de interiores profissional, criteriosa e real — não uma interface de software nem uma landing genérica feita de cartões.

## Públicos
- CASA: visualizar soluções residenciais, conhecer ambientes atendidos, ver trabalhos reais e entender como iniciar um orçamento.
- BUSINESS: entender aplicações corporativas, conferir credibilidade e iniciar uma conversa comercial.
- Arquitetos e designers: compreender a parceria de execução, alinhando projeto, medidas, materiais, especificações e fabricação.
- Visitante explorando: entender a marca rapidamente e encontrar um próximo passo claro.

## Arquitetura recomendada
Navegação principal: Projetos; CASA/Residencial; BUSINESS/Corporativo; Arquitetos; Processo; Sobre; Contato; CTA destacado Solicitar orçamento.
“Parceiros” pode ficar no rodapé e na página de arquitetos, desde que relações e autorizações sejam verificadas. “Minha conta” e “Painel administrativo” são fluxos funcionais separados do marketing e não devem competir com o CTA comercial.

Preservar rotas públicas e aliases existentes em App.tsx e manus-routes.json: início, projetos, residencial, corporativo, arquitetos, processo, parceiros, sobre, contato, minha conta/orçamentos, orçamento e privacidade. Não remover aliases durante refatoração.

## Jornada principal
Descobrir → confiar → compreender → agir.
1. Descobrir: hero comunica marca e serviço sem jargão.
2. Confiar: imagens reais, categorias claras e contato verificável.
3. Compreender: separar CASA, BUSINESS e parceria; explicar processo em etapas.
4. Agir: CTA consistente leva a contato/orçamento; formulário pede dados por etapas.

## Critérios de UX
- Cada página tem um objetivo principal e um H1 descritivo.
- CTA principal consistente; secundários não competem visualmente.
- Menu mobile acessível, com foco visível, área de toque adequada e fechamento ao navegar.
- Cards têm imagem, categoria e título; só oferecem detalhe quando existe conteúdo útil.
- Estados de carregamento, erro e vazio são claros.
- Formulário progressivo: (1) ambiente/objetivo/cidade; (2) medidas aproximadas, prazo, faixa de investimento e anexos opcionais; (3) contato, aceite de privacidade e revisão.
- A política de privacidade é um rascunho operacional e exige revisão jurídica.
- Dados de conta/admin nunca aparecem como conteúdo promocional.

## Auditoria inicial do código
- Já existem layout compartilhado, navegação, rodapé, páginas editoriais, formulário e portfólio com dados dinâmicos.
- A paleta atual usa azul-marinho, marfim e oliva/dourado discreto; títulos serifados e corpo sans-serif. É uma base aproveitável.
- Fallbacks do portfólio identificam imagens temporárias; manter transparência.
- A grade corporativa depende de registros/categorias. Sem projetos corporativos reais, não simular portfólio cheio.
- A página corporativa precisa ser avaliada por composição, fotografia, ritmo, CTA e conteúdo específico — não apenas cor.
- Páginas diferentes podem ter composições próprias, mantendo tokens, navegação e componentes comuns.

## Prioridades
### P0 — antes de aprovar a prévia
- Confirmar que o deploy corresponde ao commit e às páginas revisadas.
- Validar rotas, imagens, links, mobile, console e estados de erro.
- Garantir que nenhuma página abra sem entregar conteúdo útil.
### P1 — qualidade editorial
- Reorganizar home como narrativa da marca, não pilha de caixas.
- Criar páginas CASA e BUSINESS com introdução, prova visual, aplicações, processo e CTA próprios.
- Remover links para páginas vazias; uniformizar tipografia, largura e espaçamento.
### P2 — refinamento
- Otimizar imagens, metadados SEO, microinterações e conversão sem rastreamento invasivo.

## Referências metodológicas
Wix Studio para grids/breakpoints; Webflow Design System para tokens/componentes/templates; Nielsen Norman Group para clareza de homepage e navegação. Usar princípios, não copiar cegamente uma plataforma.
