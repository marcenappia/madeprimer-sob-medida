# 02 — Design system do site MadePrimer

## Direção criativa
Território editorial premium de interiores e marcenaria sob medida: fotografia com presença, composição arquitetônica, tipografia refinada, contraste controlado e espaço negativo. Deve parecer um estúdio de interiores maduro, não um dashboard SaaS ou um template genérico.

Princípios: editorial, não decorativo; sofisticação silenciosa; materialidade real; consistência; clareza; honestidade visual.

## Tokens de marca
Ponto de partida baseado na implementação existente. Centralizar em CSS variables, sem duplicar valores por página.

| Token | Valor | Uso |
|---|---|---|
| --mp-ink | #13232B | fundo escuro principal |
| --mp-ink-deep | #0B171D | fundo profundo/contraste |
| --mp-ink-soft | #1A3037 | superfícies escuras secundárias |
| --mp-paper | #EEE9DD | texto claro/fundo editorial |
| --mp-paper-muted | #C9C5B9 | texto secundário |
| --mp-olive | #A79B68 | acento controlado |
| --mp-olive-light | #C1B681 | realces sobre fundo escuro |
| --mp-panel | #F6F5F1 | superfície clara |

Verificar contraste real; não usar oliva em texto pequeno de baixo contraste nem dourado em grandes áreas. Alternar fundos claros e escuros com intenção narrativa.

## Tipografia
- Títulos editoriais: serifada elegante já usada no site, com fallback Georgia/Times.
- Corpo, navegação e formulários: sans-serif legível, com fallback Inter/Avenir Next/Segoe UI.
- Um H1 por página; escala fluida e largura controlada.
- H2/H3 consistentes; não usar caixa alta em todos os títulos.
- Eyebrows/metadados pequenos e espaçados, mas com contraste adequado.
- Texto corrido curto e confortável; definir tokens globais de tamanho, line-height e largura.

## Layout e grid
- Container centralizado e margens fluidas.
- Desktop: grid editorial de 12 colunas como referência mental; proporção texto/imagem varia conforme conteúdo.
- Tablet: reduzir colunas e gaps sem destruir a hierarquia tipográfica.
- Mobile: uma coluna, ordem de leitura clara, crop intencional e CTA fácil de tocar.
- Escala de espaçamento consistente: 4/8/12/16/24/32/48/64/96 px.
- Preferir unidades fluidas e clamp quando apropriado; evitar alturas fixas que cortem conteúdo.
- Header sobre hero precisa manter contraste e não cobrir o conteúdo.

## Componentes
### Header
Logo real, alt apropriado, links concisos, CTA destacado; menu mobile com estado acessível e área de toque adequada.

### Botões e links
Variantes primário, secundário/contornado e link editorial. Estados padrão, hover, foco, pressionado, desabilitado e carregando. Rótulos com verbos claros.

### Cards de projeto
Imagem com proporção consistente por coleção; categoria e título legíveis; alt descritivo; sem sobreposição de texto em área de baixo contraste. Placeholder não pode parecer obra real. Só mostrar detalhes quando houver conteúdo útil.

### Seções
Hero com mensagem, apoio e CTA; intro de página com H1 e lead; blocos editoriais variados; processo em etapas; CTA final com uma ação; footer responsivo com contato, links, redes e políticas.

### Formulários
Labels persistentes, erros junto aos campos, foco claro, validação sem apagar o que foi preenchido, formatos de anexos explicados e confirmação somente após servidor confirmar persistência.

## Imagem
Priorizar fotos reais da MadePrimer autorizadas. Não representar imagem de terceiros ou render conceitual como obra executada. Registrar origem dos ativos; usar formatos/tamanhos responsivos, dimensões/aspect-ratio, lazy-load abaixo da dobra e carregamento prioritário só para imagem principal. Garantir fallback quando imagem falhar.

## Movimento
Transições discretas; evitar scroll-jacking, parallax obrigatório e animações em loop. Respeitar prefers-reduced-motion. Não usar emojis como ícones; reutilizar o conjunto de ícones já instalado.

## Responsividade e acessibilidade
Testar 360, 390, 768, 1024 e 1440 px: sem scroll horizontal, títulos sem cortes, cards sem sobreposição, imagens bem enquadradas, foco visível, ordem de tab, landmarks semânticos, contraste, alt text, zoom habilitado e movimento reduzido respeitado. Alvos de toque recomendados: pelo menos 44 × 44 CSS px.

## Regras técnicas
- Tokens em uma fonte única; componentes compartilhados antes de criar classes específicas.
- Não criar CSS paralelo para o mesmo padrão.
- Não instalar uma biblioteca de dashboard para estilizar o site editorial.
- Wix Studio é referência para grid/breakpoints; Wix Design System é mais orientado a apps/painéis. Não migrar a plataforma.
- Validar mudanças na prévia correta em desktop e celular.
