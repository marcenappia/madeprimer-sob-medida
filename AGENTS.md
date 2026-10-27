<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Structure
- Lead capture goes through the LeadRepository interface in src/lib/leads.ts; swap the demo implementation for a real backend later without touching the form.
- Any future AI visual must render AI_VISUAL_DISCLAIMER from src/lib/leads.ts.

## Escopo atual da aplicação (substitui as notas históricas de Structure acima)
- A aplicação MadePrimer ativa usa Vite com raiz `client/`; suas rotas, páginas, componentes, manifesto de rotas e ativos públicos ficam em `client/`. O `vite.config.ts` e `package.json` deste projeto são a fonte de verdade para executar e construir o app.
- O `src/`, `public/` e `index.html` na raiz são restos do protótipo Lovable anterior, mantidos para preservar o histórico e não usados pela raiz Vite atual. Não acrescente funcionalidades novas a `src/lib/leads.ts` nem presuma que essa implementação ainda controla o formulário.
- O servidor Express/tRPC e o callback/sessão Manus OAuth ficam em `server/`; os tipos compartilhados ficam em `shared/`; o banco MySQL e as migrações aditivas ficam em `drizzle/`. As APIs administrativas devem exigir sessão e allowlist validada no servidor; `MADEPRIMER_ADMIN_EMAILS` vazio ou ausente deve negar acesso.
- Não inserir registros de demonstração nem testar criando orçamentos no banco compartilhado. Os módulos de Atendimento IA permanecem inativos sem autorização futura e não devem chamar modelos. Qualquer futura visualização por IA autorizada deve mostrar exatamente: “Visualização conceitual — não é projeto executivo.”
- Commit normal em `main` pode sincronizar o editor Lovable; não force-push, não publique no domínio oficial sem autorização explícita e não inclua credenciais, dados pessoais ou a allowlist no Git.
