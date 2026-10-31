# Publicação de Porto Sucata

Endereço: https://porto-sucata.vercel.app

Alvo exclusivo em deployment-target.json: projeto porto-sucata, ID prj_KZser93HmHNBbRFfa8veynMQrDYN, equipe team_VneHRHB9ulmmfjjE6Z4ECNxb. A equipe contém so-na-rede no nome; isso não autoriza alterar o outro projeto do usuário.

## Método atual — 2026-10-31

1. npm ci, npm test e npm run test:e2e.
2. npm run build para validar localmente.
3. Commit/push em VitorPDB/Porto-Sucata, main.
4. Build Vercel: framework vite, installCommand npm ci, buildCommand npm run build, outputDirectory dist. Configuração versionada em vercel.json.
5. Confirmar deployment READY, SHA da fonte e alias de produção. Caso push não dispare, criar deployment via integração Git no mesmo projeto, apontando para o commit exato.
6. Executar Playwright com PORTO_BASE_URL=https://porto-sucata.vercel.app; confirmar SQL/WASM e missão completos no endereço público.
7. Registrar ID do deployment e commit em deployment-target.json e contexto.

## Histórico

A primeira publicação (ba062ed) foi upload direto do dist porque a integração Git não estava disponível. Em 31/10, o deployment dpl_GT88oPaogr2aDmZfaSUAdPqFqgsy confirmou source=git e githubCommitSha=0ce9cdf2e4cc76e2b03a720904737f9c8ee0533e. A configuração anterior com build/install vazios foi substituída pela compilação Vite. Não repetir upload estático sobre o projeto configurado para Git sem registrar a mudança de método.
