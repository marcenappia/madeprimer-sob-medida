---
name: resolve-madeprimer-vercel
description: Execute a recuperação técnica e publique uma prévia funcional da MadePrimer.
agent: madeprimer-vercel-recovery
---

Assuma a missão de recuperação da aplicação MadePrimer e EXECUTE o trabalho, não responda apenas com um plano.

Repositório: marcenappia/madeprimer-sob-medida
Branch de trabalho preferencial: fix/vercel-api-runtime
Projeto Vercel: madeprimer-site-preview
Issue de acompanhamento: https://github.com/marcenappia/madeprimer-sob-medida/issues/2

Analise todas as branches relevantes e os arquivos de configuração, descubra a causa raiz dos erros do Vercel, implemente correções seguras, rode build/typecheck/testes, publique uma nova PREVIEW e valide os endpoints e o login na URL implantada. Trabalhe em commits claros, preserve mudanças existentes e atualize a issue com evidências.

Respeite integralmente as instruções de .github/agents/madeprimer-vercel-recovery.agent.md e AGENTS.md. Não altere domínio oficial nem produção, não toque no banco/migrações/dados, não enfraqueça autenticação/RLS e não use serviços ou créditos pagos. Se uma variável secreta estiver faltando, informe apenas seu nome e pare somente na etapa que realmente depende dela.

Ao final, entregue: causa raiz; branches inspecionadas; arquivos alterados; commits; comandos e resultados dos testes; URL do deployment de preview; resultados HTTP reais; estado do login; bloqueios externos concretos. Não declare sucesso sem comprovação.
