# Referência pública Base44 — MadePrimer

Fonte primária do texto e da estrutura: https://madeprimer.base44.app/ e rotas relacionadas. Consulta feita em 26–27/10/2026. O mapeamento integral URL → arquivo local das fotografias está em [`ASSET_SOURCES.md`](./ASSET_SOURCES.md); estes dados foram preservados para fidelidade da interface, sem inferir conteúdo ausente.

## Home e navegação

- URL: https://madeprimer.base44.app/
- Navegação: PROJETOS; RESIDENCIAL; CORPORATIVO; ARQUITETOS; PROCESSO; PARCEIROS; SOBRE; CONTATO; MINHA CONTA; SOLICITAR ORÇAMENTO.
- Hero: “MADEPRIMER · PLANEJADOS DE INTERIORES”; “O toque fino da marcenaria premium.”; “CONHEÇA NOSSOS PROJETOS”.
- Manifesto: “MANIFESTO”; “O luxo está nos detalhes.”; “MadePrimer · Planejados de Interiores. Nosso portfólio reúne cozinhas, dormitórios, salas, bancadas, áreas gourmet e marcenaria corporativa. Conheça os projetos e os detalhes de cada ambiente.”
- Portfólio da home: PORTFÓLIO / Projetos / VER TODOS; 01 COZINHA — “Cozinha com armários amadeirados”; 02 LIVING — “Sala com estante e cristaleira”; 03 DORMITÓRIO — “Dormitório com bancada e espelho”; 04 CORPORATIVO — “Divisórias e marcenaria corporativa”; 05 PROJETOS ESPECIAIS — “Bancadas sob medida”.
- Seções residenciais, corporativas, arquitetos, processo e parceiros: transcritas literalmente no próprio [`TODO.md`](./TODO.md) e no código `client/src/components/site/content.ts`, a partir do texto original listado em `docs/base44-transcriptions/home.md`.
- CTA final: “Vamos conversar sobre seu próximo projeto?” / “FALAR COM A MADEPRIMER”.
- Rodapé: descrição MadePrimer; “FALAR NO WHATSAPP”; navegação; contatos (11) 97975-6780, (11) 98865-3576; Rua Diadema, 10; Jandira — SP; Instagram, Facebook, LinkedIn, YouTube e Pinterest; “© 2026 MadePrimer Móveis sob medida. Todos os direitos reservados.”; Política de privacidade; Painel administrativo.

## Páginas de portfólio

- `/projetos`: “PORTFÓLIO”; “Projetos”; “Conheça o portfólio MadePrimer: projetos residenciais e corporativos, com imagens e detalhes de cada ambiente.” Filtros: TODOS, COZINHAS, DORMITÓRIOS, SALAS, GOURMET, BANHEIROS, CORPORATIVO, ESPECIAIS. Contagens de origem: 5 fotos · 2 projetos de cozinhas; 3 fotos · 1 projeto de dormitórios; 32 fotos · 2 projetos de salas/ambiente integrado; 1 foto · 1 projeto gourmet; 4 fotos · 1 projeto de banheiro; 3 fotos · 1 projeto corporativo; 6 fotos · 1 projeto especial. CTA: “Quer um projeto como estes?” / “Adaptamos qualquer conceito ao seu espaço, estilo e necessidade.” / “FALAR COM A MADEPRIMER”.
- `/ambientes-residenciais`: título “Para viver bem, cada detalhe precisa fazer sentido.”; descrição “Conheça os projetos do nosso portfólio: cozinhas, dormitórios com bancadas e espelhos, salas com estantes e cristaleiras, ambientes gourmet e banheiros.”; todos os filtros residenciais e suas contagens da origem.
- `/ambientes-corporativos`: título “Ambientes também comunicam marcas.”; descrição “Divisórias ripadas, áreas de trabalho e marcenaria integrada: conheça os ambientes profissionais apresentados no portfólio MadePrimer.”; filtro CORPORATIVO; 3 fotos · 1 projeto.

## Nove detalhes de projeto

Nos nove detalhes, a navegação e o rodapé vêm da mesma fonte. As ações são “SOLICITAR PROJETO SEMELHANTE”, “PEDIR ORÇAMENTO DETALHADO” e “INICIAR MEU PROJETO”; a chamada é “Quer um projeto como este?” / “Adaptamos este conceito ao seu espaço, estilo e orçamento.”

1. https://madeprimer.base44.app/projetos/cozinha-armarios-amadeirados — COZINHAS PLANEJADAS; “Cozinha com armários amadeirados”; “Cozinha planejada com armários em acabamento amadeirado, bancada e espaço para os eletrodomésticos. O portfólio apresenta diferentes vistas da composição.”; ficha técnica “CATEGORIA / Cozinhas Planejadas”; 4 fotos locais `kitchen-01.jpg`–`kitchen-04.jpg`. Transcrição literal: `docs/base44-transcriptions/project-kitchen-cabinets.md`.
2. https://madeprimer.base44.app/projetos/cozinha-planejada-ilha — COZINHAS PLANEJADAS; “Cozinha planejada com ilha”; “Cozinha com ilha, armários e espaço para refrigerador. O projeto apresenta a disposição do mobiliário e a integração da bancada com o ambiente.”; categoria “Cozinhas Planejadas”; 1 foto `residential-kitchen-island.jpg`.
3. https://madeprimer.base44.app/projetos/dormitorio-bancada-espelho — Closets e Dormitórios; “Dormitório com bancada e espelho”; “Projeto de dormitório com cama, bancada, espelho e prateleiras. A marcenaria reúne o espaço de descanso e uma área de apoio para a rotina.”; 3 fotos `bedroom-01.jpg`–`bedroom-03.jpg`.
4. https://madeprimer.base44.app/projetos/sala-estante-cristaleira — SALAS E PAINÉIS DE TV; “Sala com estante e cristaleira”; “Marcenaria para sala com estante e cristaleira. A galeria apresenta as composições do mobiliário e os detalhes da área de exposição e armazenamento.”; 7 fotos `living-01.jpg`–`living-07.jpg`.
5. https://madeprimer.base44.app/projetos/ambiente-integrado-painel-ripado — SALAS E PAINÉIS DE TV; “Ambiente integrado com painel ripado”; “Ambiente integrado com sala planejada, painel ripado e cruz. A galeria também apresenta a cozinha, os armários e a área de convivência do projeto.”; 25 itens de imagem na fonte, dos quais um é somente o ícone genérico de imagem quebrada da URL Wix `https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png`. Ele permanece na posição 1 e deve ser identificado como indisponível, nunca anunciado como fotografia. Os demais 24 são `integrated-02.jpg`–`integrated-25.jpg`.
6. https://madeprimer.base44.app/projetos/area-gourmet-forno-tijolos — Espaços Gourmet; “Área gourmet com forno de tijolos”; “Ambiente gourmet com armários claros e forno de tijolos. A composição reúne marcenaria e área de preparo em um mesmo espaço.”; 1 foto `gourmet-01.jpg`.
7. https://madeprimer.base44.app/projetos/banheiro-casal — BANHEIROS; “Banheiro do casal”; “Projeto de banheiro do casal apresentado nos materiais da MadePrimer. A galeria reúne as imagens da proposta de marcenaria para o ambiente.”; 4 fotos `bathroom-01.png`–`bathroom-04.png`.
8. https://madeprimer.base44.app/projetos/divisorias-marcenaria-corporativa — Corporativo; “Divisórias e marcenaria corporativa”; “Ambiente profissional com divisórias ripadas, áreas de trabalho e marcenaria integrada. As imagens apresentam diferentes vistas da composição dos espaços.”; 3 fotos `corporate-01.jpg`–`corporate-03.jpg`.
9. https://madeprimer.base44.app/projetos/bancadas-sob-medida — PROJETOS ESPECIAIS; “Bancadas sob medida”; “Marcenaria especializada em bancadas. A galeria apresenta composições de bancadas e mobiliário para cozinhas do portfólio MadePrimer.”; ficha técnica “CATEGORIA / Projetos Especiais”; 6 fotos `special-01.png`–`special-06.png`. Transcrição literal: `docs/base44-transcriptions/project-custom-countertops.md`.

## Observação sobre fonte dinâmica

As transcrições integrais salvas em `docs/base44-transcriptions/` foram usadas para verificar o conteúdo da home, das páginas de portfólio e dos nove detalhes. O conteúdo exato das rotas `/arquitetos`, `/processo`, `/parceiros`, `/sobre`, `/contato`, `/meus-orcamentos` e `/orcamento` não está transcrito integralmente em arquivo de referência. Em 27/10/2026, a navegação renderizada de `/sobre` respondeu `{"error_type":"HTTPException","message":"App not found"}`, e a extração direta das sete rotas não retornou conteúdo. Não apresentar copy inferida dessas páginas como literal; onde necessário, manter somente textos já confirmados e informações empresariais verificadas.
