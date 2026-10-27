# MadePrimer — Planejados de Interiores

Implementação do site público MadePrimer com base na referência [madeprimer.base44.app](https://madeprimer.base44.app/) e painel administrativo funcional com login Manus OAuth e persistência MySQL no runtime Webdev. O domínio oficial **não está publicado por esta entrega**; a publicação automática permanece desativada.

O repositório GitHub usado para versionamento é `marcenappia/madeprimer-sob-medida`. O runtime Webdev e o repositório existente mantêm histórias de Git separadas, sincronizadas por commits normais, sem reescrita ou force-push. Este repositório é público: não inclua dados pessoais, listas de e-mails autorizados, tokens, credenciais ou arquivos `.env` em commits.

## Escopo do site

A implementação preserva o conteúdo editorial Base44 e suas seções: Projetos, Residencial, Corporativo, Arquitetos, Processo, Parceiros, Sobre, Contato, Minha conta e Solicitar orçamento. O formulário registra pedidos em três etapas: ambiente/objetivo/cidade; medidas, prazo, faixa de investimento e anexos opcionais; nome, telefone, e-mail, aceite de privacidade e revisão.

O conteúdo público de projetos e parceiros é exibido a partir de registros publicados/ativos quando existirem. Não há semeadura de clientes, orçamentos, depoimentos, estoque, receita, estatísticas ou obras fictícias. A fotografia de cozinha usada no portfólio já está publicada no site MadePrimer; cartões sem fotografia fornecida ficam identificados como “Imagem temporária”.

## Painel administrativo

`/admin` contém Painel, Projetos, Orçamentos, Depoimentos, Serviços, Parcerias, Financeiro, Relatório financeiro, Equipe, Estoque, Atendimento IA, Relatórios e Configurações. Consultas e mutations administrativas verificam autenticação e autorização no servidor. Orçamentos e anexos contêm dados pessoais; anexos são armazenados de forma privada e só podem ser baixados após uma verificação administrativa.

Atendimento IA permanece inativo nesta entrega: não chama modelos nem envia dados a serviços de IA. A allowlist ausente ou vazia nega o acesso administrativo.

## Autenticação e configuração protegida

- `MADEPRIMER_ADMIN_EMAILS` é obrigatório para autorizar administradores. Informe a lista separada por vírgulas, ponto e vírgula ou nova linha somente pelo cartão protegido de configuração do projeto. Não copie os endereços para Git, README, `.env` ou mensagens. Até a configuração, nenhum administrador consegue entrar.
- `MANUS_PROJECT_ID`, `MANUS_OAUTH_PORTAL_URL`, `MANUS_OAUTH_API_URL` e `MANUS_JWT_SECRET` são valores de autenticação fornecidos pelo runtime.
- `DATABASE_URL` é a conexão MySQL gerenciada. `MANUS_API_URL` e `MANUS_API_KEY` são usados pelo servidor para armazenamento privado durável.
- Por padrão, cookies da aplicação usam `HttpOnly; Secure; SameSite=None`, necessário para Preview HTTPS incorporado. Apenas em uma execução local servida por HTTP, pode-se configurar `MADEPRIMER_COOKIE_SECURE=false` fora do código versionado; mantenha o padrão seguro no Preview HTTPS e na publicação.

O fluxo de autenticação usa a sessão `webdev_app_session`, nonce de uso único e destino fixo `/admin`. O servidor verifica a lista autorizada no callback, em `auth.me` e em cada procedimento administrativo. Não existe usuário de demonstração nem atalho para Preview.

## Persistência e migrações

Acesso de banco fica em `server/db.ts`, serviços e validações em `server/data.ts`, contratos tRPC em `server/routers.ts`, schema Drizzle em `drizzle/schema.ts` e migrações em `drizzle/`. O schema adiciona solicitações e histórico de status, anexos/tickets temporários, registros dos módulos, movimentos de estoque, configurações públicas, auditoria e usuários OAuth. As novas migrações são aditivas e não apagam as tabelas preexistentes.

O banco de desenvolvimento e o banco da publicação são o mesmo banco gerenciado. Mudanças de esquema e gravações de desenvolvimento afetam os dados usados pela versão publicada. Não envie formulário de teste nem insira registros demonstrativos no banco compartilhado.

## Desenvolvimento e comandos

Dependências: Node.js do starter e `pnpm@10.18.0`.

```bash
pnpm check
pnpm build
pnpm dev
```

A aplicação escuta a porta configurada (`PORT`, padrão 3000) e expõe `/api/health`. Para uma alteração intencional no schema, revise o SQL gerado antes de aplicar:

```bash
pnpm exec drizzle-kit generate
# Revise drizzle/NNNN_*.sql e confirme que a mudança é aditiva.
pnpm db:migrate
```

`pnpm db:push` também gera e aplica migrações; não o use sem revisar o SQL primeiro. Typecheck e build não criam orçamentos de teste nem escrevem dados no banco.

Rotas são declaradas em `client/src/App.tsx`; o manifesto `client/public/manus-routes.json` deve permanecer sincronizado. O código serve via Preview para revisão. Nenhuma publicação em `madeprimer.com.br` foi autorizada ou realizada.

## Estrutura

Os diretórios e arquivos legados `src/`, `public/` e `index.html` na raiz são mantidos por histórico do protótipo Lovable e não fazem parte da aplicação ativa, cuja raiz Vite é `client/`.

- `client/src/components/site/`: navegação, rodapé e conteúdo público MadePrimer.
- `client/src/pages/`: páginas editoriais, formulário de orçamento e painel de administração.
- `server/_core/`: integração OAuth Manus, sessão, runtime Express e middleware tRPC.
- `server/access.ts`, `server/data.ts`, `server/quotes-http.ts`: allowlist, persistência e anexos privados.
- `drizzle/`: schema e migrações do banco.
- `shared/`: contratos de tipos e constantes usados no servidor e cliente.
- `plan.md`, `TODO.md`, `ASSET_SOURCES.md`: escopo aprovado, andamento e proveniência visual.

A cópia de privacidade do formulário é um rascunho operacional que explica armazenamento e uso dos dados; exige revisão jurídica pela MadePrimer antes de qualquer publicação oficial. Para limites e critérios detalhados, consulte `plan.md` e `TODO.md`.
