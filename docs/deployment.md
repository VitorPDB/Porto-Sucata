# Publicação do primeiro recorte

Endereço: https://porto-sucata.vercel.app

O alvo exato está em `deployment-target.json`. O nome da equipe contém `so-na-rede`, mas o projeto é exclusivamente **porto-sucata**, ID `prj_KZser93HmHNBbRFfa8veynMQrDYN`. Não alterar os projetos antigos.

## Método atual

1. Instalar pelo lockfile com `npm ci` e executar os testes relevantes.
2. Gerar `dist` com `npm run build`.
3. Enviar os arquivos desse build ao projeto alvo pela API/MCP Vercel, preservando os caminhos `dist/...`.
4. Configuração desta modalidade: framework null, buildCommand vazio, installCommand vazio, outputDirectory `dist`. O build já foi feito localmente; não há fonte para recompilar no servidor.
5. Confirmar READY e aliases; verificar o fluxo no endereço público com `PORTO_BASE_URL` e Playwright.
6. Atualizar contexto e metadados de publicação; commit/push do código e deploy são operações separadas.

A primeira publicação corresponde ao código do commit `ba062ed`. O worker e WASM são servidos pelo próprio deploy, sem depender de CDN para executar SQL.

## Por que não aparece um commit na Vercel?

A integração GitHub da Vercel não estava instalada para essa conta. A tentativa de vincular o repositório foi recusada, então a publicação usou os arquivos do build. O GitHub contém o histórico normalmente, mas o deploy direto não apresenta uma associação Git automática.

Não prometer que um push dispara deploy nesta configuração. Para habilitar essa integração futuramente, conectar **VitorPDB/Porto-Sucata** ao mesmo projeto e substituir as configurações estáticas por: framework Vite, installCommand `npm ci`, buildCommand `npm run build`, outputDirectory `dist`, Node 22.12+ ou 24. Confirmar novamente os IDs antes de alterar qualquer configuração.
