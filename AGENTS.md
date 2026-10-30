# Instruções permanentes de continuidade

Estas instruções valem para todo o repositório. Instruções explícitas mais recentes do usuário prevalecem; registrar a mudança de decisão no contexto.

## Antes de trabalhar

1. Ler integralmente `CONTEXTO_DO_PROJETO.md` e `art/references/README.md`.
2. Verificar estado do Git e alterações existentes. Não sobrescrever trabalho de terceiros.
3. Antes de editar arte ou interface, abrir as pranchas relevantes e inspecionar a implementação atual, caso exista. Não reconstruir o estilo apenas a partir de memória textual.
4. Distinguir aprovação do usuário, proposta de design e comportamento implementado. Não apresentar uma imagem conceitual como tela funcional.

## Atualização obrigatória do contexto

Em CADA conjunto de modificações no repositório, atualizar `CONTEXTO_DO_PROJETO.md` antes de concluir ou criar o commit, inclusive quando a mudança for apenas de documentação, assets ou correção pequena.

- Atualizar a seção afetada, não apenas adicionar uma nota ao histórico.
- Registrar data, arquivos/áreas alterados, motivo, efeitos na arte/gameplay/conteúdo, verificação realizada e pendências reais.
- Registrar decisões revogadas e a decisão que as substitui. Não deixar duas regras contraditórias como atuais.
- Atualizar o estado implementado com precisão. Não marcar uma intenção como funcional.
- Quando houver nova arte, manter versão anterior, registrar procedência, status de aprovação e caminho no inventário.
- Quando houver missões, registrar pré-requisitos, objetivo, dados, solução/validação, dicas, recompensa, retomada e fonte pedagógica.
- Não é necessário criar alterações artificiais quando a atividade for somente leitura ou conversa sem mudança de decisão. Quando a conversa mudar uma decisão, consolidá-la na próxima edição autorizada.

## Identidade que deve ser preservada

- Single player, celular prioritário, progresso constante e sessões interrompíveis.
- Câmera de cima inclinada, sem rotação; personagens e objetos legíveis no celular.
- Paleta contida: petróleo, creme e ferrugem, âmbar pontual. Não usar neon, arco-íris ou grandes superfícies muito saturadas.
- Arte do mundo pixelada; código, diálogos e comandos com tipografia limpa.
- Hierarquia: mundo/objetivo/contexto na exploração; pedido/código/dados/ação no terminal; consequência/feedback/próximo passo no resultado.
- Seleção ativa explícita em abas, objetos e tópicos; não comunicar estados apenas pela cor.
- Sem energia, vida diária, streak punitivo, ranking, multiplayer ou espera real obrigatória.
- Erro permite entender e tentar de novo; não apagar código ou conquistas.

## Integridade pedagógica

- Usar os materiais de estudo do usuário como base; exemplos ficcionais devem ser identificados como exercícios didáticos autorais.
- Não inventar fonte, página, saída, execução SQL ou benchmark.
- Diferenciar MySQL e Oracle. Um interpretador parcial não deve ser anunciado como suporte completo a SQL.
- SQL consulta dados; o controlador do jogo usa o resultado para movimentar o drone. Não ensinar SQL como linguagem de movimento.
- Hadoop/Sqoop/Spark simulados devem ser declarados como simulações; entrada, regras e saída precisam ser consistentes.
- Preservar o dataset Produtos original quando usado como exercício de origem.

## Repositório e publicação

- Repositório autorizado: `https://github.com/VitorPDB/Porto-Sucata.git`.
- Não alterar o projeto Vercel existente do usuário chamado "so na rede".
- `dados-em-curso` é o aplicativo de estudo anterior e um projeto distinto. Não migrar, apagar ou substituir automaticamente.
- Não publicar PDFs/DOCX de aula, dados institucionais, credenciais, anexos pessoais ou diretórios de configuração locais neste repositório público.
- Não fazer force push nem reescrever histórico para organizar documentação.

## Verificar antes de encerrar

- Links e arquivos referenciados existem; novas artes estão no repositório, não apenas no cache de geração.
- Texto do contexto descreve a versão que está sendo entregue.
- Para UI implementada: conferir ao menos 360px de largura, toque, teclado/foco, seleção ativa, contraste e estados de erro/retomada; não inventar verificação se não executada.
- Para lógica de jogo: validar dados e resultados, soluções equivalentes e persistência conforme o escopo da mudança.
- Reportar o que mudou, como foi verificado e qualquer limitação que permaneça.
