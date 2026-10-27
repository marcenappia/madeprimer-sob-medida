# Migração completa MadePrimer para Vercel: provedores e custos

**Atualizado em 27 de outubro de 2026.** Este comparativo não cria recursos nem autoriza deployment. O domínio `madeprimer.com.br` continua fora da configuração.

## Situação atual

O aplicativo usa Express/tRPC, Drizzle com `mysql2`, Manus OAuth e o serviço Manus para anexos privados. O entrypoint atual em `server/_core/index.ts` cria um servidor e chama `listen`, mas não exporta a aplicação como entrypoint Vercel. A entrega de assets também precisa ser adaptada: na Vercel, `express.static()` não serve os arquivos; a plataforma espera assets em `public/`. Portanto, a cópia atual do GitHub ainda não é um deployment funcional apenas por importação do repositório. [1]

A conta Vercel não foi acessada nesta sessão e o ambiente não tem Vercel CLI nem vínculo `.vercel/project.json`; ainda não sabemos se a conta está no plano Hobby/Pro nem se há um projeto existente.

## Opção A — TiDB Cloud Starter + Vercel Blob privado

Esta é a opção com menor mudança no código de dados porque o projeto já usa MySQL. O TiDB é compatível com o protocolo MySQL e recursos comuns do MySQL 5.7/8.0, mas não é compatível em todos os recursos; schema e migrations ainda precisam de verificação. [2]

O preço oficial do TiDB Starter anuncia franquia mensal de **25 GiB de dados em linha, 25 GiB colunares e 250 milhões de Request Units por organização**, em até cinco instâncias elegíveis. Acima dela, as tarifas publicadas começam em **US$ 0,10 por milhão de RUs, US$ 0,20/GiB-mês em linha e US$ 0,05/GiB-mês colunar**; os valores variam por região. A integração Vercel Marketplace pode fornecer variáveis de conexão; a configuração genérica entrega `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD` e `TIDB_DATABASE`, que precisam ser transformadas em configuração segura para `mysql2` ou em `DATABASE_URL`. [3] [4]

Para anexos, Vercel Blob em modo privado evita URLs públicas. A aplicação teria de substituir o atual adaptador Manus e autorizar cada leitura. As tarifas publicadas incluem **US$ 0,023/GB-mês de armazenamento, US$ 0,40 por milhão de operações simples, US$ 5 por milhão de operações avançadas e US$ 0,05/GB de transferência**; o custo real depende de uploads e downloads. Downloads privados são transmitidos por uma Function e podem gerar custos de transferência tanto entre Blob e Function quanto entre Function e navegador. [5] [6]

**Estimativa-base:** TiDB pode custar **US$ 0/mês dentro da franquia**; Blob é por uso. A Vercel Pro, necessária para uso comercial, custa **US$ 20 por assento de desenvolvedor/mês** e inclui **US$ 20 de crédito de uso**, antes de tributos. Se a conta já tiver um assento Pro, o custo-base incremental pode ser menor. [7]

## Opção B — Supabase Postgres + Supabase Storage privado

O Supabase oferece banco PostgreSQL e storage no mesmo provedor e tem integração pelo Vercel Marketplace, com sincronização de variáveis de ambiente e faturamento pelo Vercel. A integração está marcada pela documentação como **Public Alpha**; projetos desse caminho só podem ser criados pelo Dashboard Vercel, e o Marketplace tem limitações próprias. [8] [9]

No plano Supabase Free, a franquia publicada é **500 MB de banco, 1 GB de arquivos e 5 GB de egress**; projetos gratuitos são pausados após uma semana sem atividade. Isso serve para experimentar, não para manter uma aplicação comercial confiável. No plano Pro, a página lista **US$ 25/mês**, primeiro projeto incluído, **8 GB de banco, 100 GB de arquivos e 250 GB de egress**. O Pro inclui **US$ 10/mês em créditos de compute**, suficiente para um projeto Micro; acima das franquias, a página publica US$ 0,125/GB adicional de banco, US$ 0,0213/GB adicional de arquivos e US$ 0,09/GB adicional de egress, além das demais tarifas aplicáveis. [10]

Buckets privados do Supabase podem emitir URLs assinadas com validade limitada. A documentação alerta que URLs assinadas permanecem válidas até expirarem e não podem ser revogadas individualmente antes disso; a aplicação deve usar prazos curtos e não compartilhar esses links com usuários não autorizados. [11]

Esta opção exige trocar o driver `mysql2` e converter o schema e migrations Drizzle de MySQL para PostgreSQL, além de revisar os procedimentos SQL. Ela tende a simplificar o vínculo entre banco e anexos e oferece uma franquia de arquivos maior no Pro, mas custa mais e exige mais trabalho de migração que TiDB + Blob.

**Estimativa-base:** Supabase Pro **US$ 25/mês** + Vercel Pro **US$ 20 por assento/mês**, se nenhum desses planos já estiver ativo ou disponível. Projeção inicial conjunta: **US$ 45/mês antes de impostos e uso excedente**; o crédito de compute de US$ 10 do Supabase cobre um Micro, conforme a calculadora oficial. [7] [10]

## Comparação e decisão pendente

Se a prioridade for reaproveitar o código MySQL e começar com menor custo-base, TiDB Starter + Blob é a opção mais simples, sujeita a validar a compatibilidade do schema e aos custos variáveis de Blob. Se a prioridade for concentrar Postgres e arquivos num único serviço, e aceitar migrar o schema, Supabase Pro + Storage oferece franquias previsíveis maiores para arquivos, com estimativa-base mais alta. Nenhuma opção foi provisionada ou escolhida ainda.

Em ambas, Vercel Pro/Enterprise é necessário para o uso comercial deste site; o plano Hobby é restrito a uso pessoal não comercial. [7] Não é possível projetar custos de Blob, egress ou compute sem volume mensal de anexos e leituras.

## Trabalho e limites antes de publicar

Qualquer escolha exigirá um entrypoint Express compatível com Vercel, entrega de assets estáticos e rotas SPA/API, banco/armazenamento externos, migrações e configuração protegida das variáveis. Manus OAuth e a allowlist de e-mails continuam como requisito, mas será necessário garantir que o callback do domínio Vercel escolhido esteja autorizado. Nenhum segredo será colocado no GitHub.

Não consultei nem copiei registros de orçamento ou anexos existentes. A migração de dados requer definir quais tabelas e arquivos serão transferidos. O `TODO.md` ainda marca sete rotas institucionais sem transcrição literal, e a política de privacidade está identificada como rascunho para revisão jurídica; isso precisa ser resolvido antes de expor uma versão pública.

A publicação está suspensa até uma nova confirmação explícita. Se o projeto Vercel ainda não tiver deployments, a documentação informa que o primeiro é tratado como Production mesmo quando se seleciona o alvo Preview. Não criarei projeto, banco, storage, deployment ou associação com `madeprimer.com.br` nesta etapa. [12]

## Fontes oficiais

[1]: https://vercel.com/docs/frameworks/backend/express "Express on Vercel"
[2]: https://docs.pingcap.com/tidb/stable/mysql-compatibility/ "TiDB MySQL compatibility"
[3]: https://www.pingcap.com/pricing/ "TiDB Cloud pricing"
[4]: https://vercel.com/marketplace/tidb-cloud "TiDB Cloud on Vercel Marketplace"
[5]: https://vercel.com/changelog/private-storage-for-vercel-blob-now-available-in-public-beta "Private Vercel Blob storage"
[6]: https://vercel.com/docs/vercel-blob/usage-and-pricing "Vercel Blob pricing"
[7]: https://vercel.com/pricing "Vercel pricing"
[8]: https://vercel.com/marketplace/supabase "Supabase on Vercel Marketplace"
[9]: https://supabase.com/docs/guides/integrations/vercel-marketplace "Supabase Vercel Marketplace integration"
[10]: https://supabase.com/pricing "Supabase pricing"
[11]: https://supabase.com/docs/guides/storage/serving/downloads "Supabase private Storage downloads"
[12]: https://vercel.com/docs/deployments/environments "Vercel deployment environments"
