# MadePrimer — documentação do site

Esta pasta concentra a especificação editorial, de UX/UI e de design system do site público MadePrimer. O objetivo é orientar a evolução do site existente sem reconstruí-lo, trocar sua plataforma ou alterar a persistência administrativa.

## Documentos
1. [Auditoria e arquitetura de informação](./01-auditoria-ux-ia.md) — objetivos, públicos, navegação, jornada e prioridades.
2. [Design system do site](./02-design-system.md) — direção visual, tokens, tipografia, grids, componentes, responsividade e acessibilidade.
3. [Mapa de páginas e conteúdo](./03-mapa-de-paginas.md) — papel de cada página, conteúdo, CTAs, relações e critérios de aceite.
4. [Landing page e narrativa da home](./04-landing-page.md) — ordem das seções, hierarquia de mensagem e recomendações de conversão.

## Princípios que não podem ser quebrados
- Marca: MadePrimer — Planejados de Interiores. Uma marca, duas frentes: CASA e BUSINESS.
- Posicionamento: “Marcenaria sob medida. Do projeto à execução.” / “Você projeta. A MadePrimer executa.”
- Prova real: não inventar obras, imagens, depoimentos, certificações, parceiros, números ou resultados. Conteúdo ausente deve ficar pendente ou ser omitido da área pública.
- Dados: não inserir dados fictícios no banco, não alterar o banco compartilhado e não expor dados pessoais de orçamentos.
- Implementação: preservar React/Vite, rotas existentes, componentes úteis e comportamento do formulário. A documentação orienta o site atual, não uma migração para Wix.
- Publicação: domínio oficial não está autorizado por esta entrega. Revisão e validação acontecem na prévia.
- Mobile-first real: testar navegação, formulários, imagens e hierarquia em telas pequenas.
- Acessibilidade e desempenho: contraste, foco visível, semântica, alt text, movimento discreto e imagens otimizadas.

Ao alterar uma página, verificar os quatro documentos, reutilizar tokens/componentes e validar desktop e celular. Registrar decisões novas aqui em vez de criar regras concorrentes.
