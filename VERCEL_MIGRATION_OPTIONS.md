# Migração completa MadePrimer para Vercel: opções e custos

**Atualizado em 27 de outubro de 2026.** Este documento recomenda uma rota de migração, não autoriza nem executa um deployment. O domínio `madeprimer.com.br` continuará fora da configuração.

## Situação atual

O aplicativo usa Express e tRPC, Drizzle com o driver MySQL (`mysql2`), Manus OAuth e o serviço de storage da Manus para gravar anexos privados. O projeto Webdev ainda funciona como runtime de referência. A cópia GitHub não está vinculada a um projeto Vercel nesta sessão: não há CLI Vercel instalado, `.vercel/project.json` nem `vercel.json`.

A Vercel aceita aplicações Express como uma Function Node.js, mas o entrypoint atual está em `server/_core/index.ts`, cria o servidor e chama `listen`; ele não exporta a aplicação como entrypoint Vercel. Além disso, assets estáticos precisam ser adaptados ao modo de entrega da Vercel: a documentação informa que `express.static()` não serve os assets da plataforma e que arquivos públicos devem estar em `public/`. Portanto, a árvore atual ainda não está pronta para um deployment funcional só por importar o repositório. [1]

## Combinação recomendada

**Banco: TiDB Cloud Starter conectado pelo Vercel Marketplace.** O TiDB é compatível com o protocolo MySQL e com recursos comuns do MySQL 5.7/8.0, o que evita começar com uma conversão completa do schema Drizzle para PostgreSQL. A compatibilidade não é total; o schema e as migrations ainda precisam ser verificados antes de mover dados. [2]

A página de preços do TiDB lista uma franquia mensal Starter de **25 GiB de dados em linha, 25 GiB colunar e 250 milhões de Request Units por organização**, para até cinco instâncias elegíveis. Acima da franquia, os valores publicados começam em **US$ 0,10 por milhão de RUs, US$ 0,20/GiB-mês de dados em linha e US$ 0,05/GiB-mês de dados colunares**; os preços variam por região e provedor de nuvem. [3] O Marketplace pode fornecer variáveis de conexão ao projeto Vercel. Para a configuração genérica, elas são `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD` e `TIDB_DATABASE`; a aplicação precisará montar uma conexão segura compatível com `mysql2` ou usar uma `DATABASE_URL` adequada. [4]

**Anexos: Vercel Blob em modo privado.** O Blob privado é indicado para documentos sensíveis e requer autenticação para operações de leitura e escrita. Será necessário substituir a integração atual com o storage Manus por um adaptador Vercel Blob e manter a autorização administrativa antes de transmitir cada anexo. [5]

Como referência de preço de uso do Blob, a Vercel publica **US$ 0,023/GB-mês de armazenamento, US$ 0,40 por milhão de operações simples, US$ 5 por milhão de operações avançadas e US$ 0,05/GB de transferência de dados**, além dos limites/créditos do plano. Downloads privados passam por uma Function e podem gerar tanto custo de transferência do Blob até a Function quanto da Function ao navegador. O custo total depende do volume de anexos, leituras e transferências, ainda desconhecido. [6]

**Plano Vercel: Pro, caso a conta atual ainda esteja no Hobby.** O Hobby é restrito a uso pessoal não comercial; o uso comercial requer Pro ou Enterprise. A tabela atual lista Pro a **US$ 20 por mês por assento de desenvolvedor**, com **US$ 20 de crédito de uso**; impostos e consumo além do crédito podem aumentar a fatura. Se a conta já tiver um assento Pro disponível, esse valor-base pode não ser incremental para este projeto, mas o estado da conta ainda não foi consultado. [7]

## Estimativa inicial

O mínimo de plataforma é **US$ 20/mês** se for necessário adicionar um assento Pro. TiDB pode ficar em **US$ 0/mês dentro da franquia Starter**. Blob e Functions dependem do uso e dos créditos disponíveis; não é possível estimar uma fatura final sem volumes de armazenamento, downloads e tráfego. Assim, a referência inicial é **US$ 20/mês, mais eventual uso acima das franquias/créditos e tributos**, se a conta Vercel não tiver Pro e se o banco ficar no Starter.

## Trabalho necessário antes de implantar

Será preciso criar um entrypoint Express adequado à Vercel, distribuir os assets estáticos pelo caminho suportado, manter a navegação SPA e rotear `/api/*`, anexos e demais páginas corretamente. O código deve aceitar as variáveis TiDB, aplicar as migrations no novo banco e substituir o storage Manus pelo Blob privado. O Manus OAuth precisará aceitar o callback do domínio Vercel escolhido, e as variáveis necessárias serão configuradas de forma protegida; nenhum valor secreto deve ser copiado para o GitHub.

Não migrei nem consultei registros de orçamento nesta etapa. Antes de copiar dados existentes, será necessário confirmar quais tabelas e anexos devem ser levados ao novo banco. O conteúdo literal de sete rotas institucionais Base44 ainda está pendente no `TODO.md`, e a política de privacidade está marcada como rascunho para revisão jurídica; esses itens devem ser resolvidos antes de expor uma primeira versão pública.

A implantação está suspensa até uma nova confirmação explícita. Se o projeto Vercel ainda não tiver nenhum deployment, a documentação informa que o primeiro deployment é tratado como Production mesmo quando se seleciona o alvo Preview. A Vercel gera um endereço de deployment; não vou associar `madeprimer.com.br` nem iniciar um deployment nesta fase. [8]

## Fontes oficiais

[1]: https://vercel.com/docs/frameworks/backend/express "Express on Vercel"
[2]: https://docs.pingcap.com/tidb/stable/mysql-compatibility/ "TiDB MySQL compatibility"
[3]: https://www.pingcap.com/pricing/ "TiDB Cloud pricing"
[4]: https://vercel.com/marketplace/tidb-cloud "TiDB Cloud on Vercel Marketplace"
[5]: https://vercel.com/changelog/private-storage-for-vercel-blob-now-available-in-public-beta "Private Vercel Blob storage"
[6]: https://vercel.com/docs/vercel-blob/usage-and-pricing "Vercel Blob pricing"
[7]: https://vercel.com/pricing "Vercel pricing"
[8]: https://vercel.com/docs/deployments/environments "Vercel deployment environments"
