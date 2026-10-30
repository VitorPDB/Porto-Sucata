# Porto Sucata — contexto vivo do projeto

Última consolidação: **29 de outubro de 2026 — America/Sao_Paulo**.

Este arquivo é a memória principal do projeto. Seu objetivo é preservar intenção, visual, hierarquia, jogabilidade e estado real mesmo quando a conversa original não estiver disponível. Deve ser atualizado em cada conjunto de modificações, conforme `AGENTS.md`.

## 1. Estado real e escopo desta versão

- Repositório escolhido pelo usuário: `VitorPDB/Porto-Sucata`, inicialmente vazio, público, branch padrão `main`.
- Esta versão organiza documentação e quatro pranchas conceituais. Não contém motor de jogo, aplicativo, personagens animados, editor SQL funcional, persistência ou mapas navegáveis.
- Nenhum framework, engine, banco embarcado ou formato de save foi escolhido para Porto Sucata.
- As imagens são arte conceitual. Os sprites, tiles, colisões, animações, componentes e estados interativos ainda precisam ser produzidos.
- O usuário pediu preservar detalhadamente o contexto e autorizou organizar o projeto conforme necessário, sem cores muito vibrantes e respeitando a hierarquia definida.
- A etapa atual é consolidar arte, mundo, personagens e comportamento das telas. Não confundir essa autorização com a aprovação de toda ideia de missão ou tecnologia sugerida.

### Classificação das decisões

- **Aprovado explicitamente:** personagens originais e estilo da primeira prancha; usuário respondeu que estava ótimo e muito bonito. Expansão com seis moradores e seis cenários recebeu "curti vei".
- **Direção apresentada, a preservar até revisão:** câmera, orientação vertical, loop, painéis de gameplay, progressão por ferramentas, elenco com papéis narrativos. O usuário solicitou continuar a expansão, mas não revisou individualmente todos os detalhes.
- **Proposta editorial nesta consolidação:** nomes de missões, cadeia narrativa, critérios de sucesso e valores hexadecimais operacionais. Não são decisões finais nem funcionalidades implementadas.
- **Implementado:** somente a base documental e o inventário de referências desta versão.

## 2. Origem e objetivo

O projeto começou como aplicativo de estudo de Big Data, Hadoop, MySQL, Sqoop, Spark e SQL, baseado nos arquivos de aula do usuário. Ele quer estudar do zero no celular, inclusive no trajeto para o trabalho/faculdade, com respostas reais, correção automática ou gabaritos claros.

O aplicativo textual ficou cansativo de consumir. As referências de game design sugeridas pelo usuário foram The Farmer Was Replaced, EXAPUNKS, Shenzhen I/O, Human Resource Machine e Robocode: programar, executar, observar o comportamento e melhorar. Depois, o usuário propôs uma aventura pixelada 2D inspirada na alternância de exploração, gestão, minijogos e eventos de Dave the Diver.

Porto Sucata é um universo original. Não copiar personagens, mapas, assets, música ou narrativa desses jogos. A inspiração é estrutural: aprender altera o mundo e abre possibilidades de ação.

### Prioridades do usuário

1. Single player e celular.
2. Progresso constante e aprendizado real.
3. Arte bonita e coesa, mundo vivo, personagens e eventos secundários.
4. Uso simples, legibilidade, feedback visual de seleção e poucas cores contrastantes.
5. Exercícios corrigidos automaticamente ou respostas explicadas disponíveis.
6. Continuidade: não perder arte ou jogabilidade por falta de contexto.

Excluir tutoriais institucionais FIAP de login/criação de máquinas. Não exigir VM institucional, ambiente de colegas ou credenciais para jogar.

## 3. Universo e fantasia do jogador

Você é um técnico recém-chegado a um porto parcialmente desativado. Com uma mecânica veterana e um drone, recupera equipamentos e registros, ajuda moradores e reconecta lugares. Cada recuperação revela um pouco da história local.

Tom: acolhedor, curioso, inventivo, com humor discreto e mistérios acessíveis. Sucata representa objetos com história e potencial, não um mundo permanentemente sombrio. Falhas técnicas podem ser divertidas e instrutivas sem humilhar o jogador.

O porto deve mudar de forma perceptível: letreiros acendem, barracas abrem, estufas florescem, exposições recebem objetos, barcos alcançam novas áreas. XP ou porcentagem nunca devem ser a única recompensa visível.

## 4. Direção de arte e referências canônicas

Abrir as imagens antes de modificar o visual:

| Arquivo | Conteúdo | Autoridade e limite |
|---|---|---|
| `art/references/01-elenco-original-camera.png` | Protagonista, mecânica, feirante, drone e oficina | Referência principal de personagens, materiais, proporção e atmosfera; explicitamente aprovada. |
| `art/references/02-gameplay-paineis.png` | Explorar, programar, ver funcionar | Referência de composição, painéis e estados; não é screenshot de software funcional. |
| `art/references/03-moradores-do-porto.png` | Nara, Bento, Lia, Ivo, Sol, Teo | Expansão apreciada pelo usuário; preservar identidades e silhuetas. |
| `art/references/04-cenarios-do-porto.png` | Seis cenários conectados | Referência ambiental apreciada; simplificar geometria para mapas jogáveis. |

### Linguagem visual

- Pixel art com agrupamentos de pixels e sombreamento contido; materiais de madeira, metal reaproveitado, lona, pedra, vidro e água.
- Personagens expressivos com silhuetas distintas e proporções estilizadas. Não reduzir todos a avatares genéricos idênticos.
- Mundo em petróleo/teal, creme e ferrugem. Âmbar para iluminação, interação e recompensa; vegetação discreta.
- Última instrução do usuário: **não usar cores muito vibrantes**. Não reinterpretar as pranchas como autorização para saturação forte, neon ou excesso de brilhos.
- Proposta inicial para tokens de UI, ainda a verificar em telas reais: fundo creme `#F3EBDD`, tinta `#263C3A`, petróleo `#294B48`, ferrugem `#9B624A`, âmbar discreto `#B58A4D`, superfície secundária `#DDD5C7`.
- Âmbar é acento, não cor padrão de texto. Medir contraste de cada combinação antes de usá-la em controles/texto.
- Não impor os seis tokens a todos os pixels da arte: sombras e variações moderadas são necessárias. UI deve manter pouca variedade.
- Retratos e mundo podem ser pixelados; código, diálogos, números e botões precisam de fonte limpa e tamanho legível.
- As pranchas são densas e com perspectiva ilustrativa. Não copiar literalmente densidade, tamanho de fonte, quantidade de objetos nem inconsistências de perspectiva para a engine.

### Câmera e composição

- Direção proposta: vista de cima inclinada, mostrando chão, frente dos equipamentos e rostos; projeção de jogo ortográfica, sem rotação.
- Grade e circulação simples; não assumir mapa isométrico em losangos apenas porque a arte conceitual tem diagonais.
- Orientação vertical prioritária. Não exigir rotação do celular para ler ou escrever código.
- Câmera acompanha suavemente em áreas pequenas e aproxima interações quando útil.
- Toque para mover/interagir é a direção inicial; controles finais dependem de teste. Não introduzir joystick, plataforma ou precisão de reflexos sem necessidade.
- Ao abrir terminal, pausar o mundo; ao executar, mostrar a consequência de forma pausável.
- Nenhuma ação essencial deve depender apenas de som, hover ou cor.

## 5. Hierarquia das telas e interações

### Exploração

Ordem de importância: **mundo e ação contextual → objetivo atual → diálogo → navegação secundária**.

- Cenário ocupa a maior parte da tela; HUD mínimo, com pausa acessível.
- Objetivo compacto: título curto e uma instrução concreta.
- Objeto selecionado recebe contorno/sinal visível e nome. Não pintar todos os objetos com destaque simultâneo.
- Quando há conversa: retrato, fala breve e uma ação principal, como "Usar bancada".
- Mapa, Mochila e Diário ficam secundários. Não transformar o mundo em dashboard com várias métricas.

### Programação

Ordem: **pedido → solução/código → dados necessários → executar → ajuda**.

- Terminal com superfície opaca creme, borda petróleo e controles amplos.
- Abas Pedido, Código e Dados; aba atual com preenchimento e estado textual/semântico visível.
- Mundo pausado indicado. Contexto visual pequeno pode permanecer, mas nunca comprimir o editor.
- Editor legível, comandos sugeridos por toque, teclado opcional, desfazer e preservação do rascunho.
- Chips de comando ajudam a escrever; não substituir indefinidamente compreensão por escolha entre respostas óbvias.
- Uma ação primária "Executar"; "Pedir dica" secundária.
- Prévia de dados deve ser identificada como dados de entrada; não confundir com resultado da consulta.
- Para tela pequena ou teclado aberto, Dados pode ficar só na aba correspondente. A prancha não obriga mostrar tabela e editor simultaneamente.

### Execução e resultado

Ordem: **efeito no mundo → resultado/explicação → recompensa → próximo passo**.

- Consulta gera dados; controlador converte esses dados em ação do drone. Não ensinar que SQL movimenta personagens diretamente.
- Sucesso mostra a mudança (ex.: feira iluminada), explica por que o resultado atende ao pedido e apresenta eventual ferramenta liberada.
- Ações: Ver consulta e Continuar.
- Tentativa incorreta mostra seleção obtida versus necessidade, dica localizada e "Ajustar consulta".
- Não apagar o código digitado nem punir com perda permanente de recursos.
- Os títulos gigantes "EXPLORAR / PROGRAMAR / VER FUNCIONAR" são rótulos da prancha, NÃO cabeçalhos que devem ocupar a tela do jogo.

## 6. Loop e ritmo

**Descobrir → entender um pedido → preparar código → executar → observar → corrigir → transformar o porto → descobrir outra possibilidade.**

Sessões-alvo de aproximadamente 3–7 minutos, sem obrigação de concluir nesse tempo. Uma missão longa pode ter pequenas etapas com salvamento. Interrupções no transporte não devem causar falha.

- Alternar exploração, programação, conversa curta e consequência visual.
- Nenhuma espera real obrigatória para cultivar, construir ou aprender.
- Nenhuma punição por ausência, energia limitada, streak obrigatório, ranking ou multiplayer.
- Eventos avançam por progresso, não por calendário real ou horário do telefone.
- Minijogos complementam o aprendizado; arcade obrigatório não deve bloquear conteúdo.
- Mundo, rascunho e estado da missão precisam ser retomáveis quando isso for implementado. Ainda não há save no repositório.

## 7. Progressão e comandos

Duas progressões relacionadas, mas distintas:

1. **Conhecimento:** explorar conceito, aplicar com ajuda, aplicar sozinho em caso novo.
2. **Equipamentos/mundo:** ferramentas restauradas, lugares acessíveis, melhorias visíveis e automações disponíveis.

Desbloqueio proposto: problema concreto → demonstração/dica → tentativa → aplicação nova → ferramenta integrada à oficina. Não exigir moagem de XP, moeda ou repetir a mesma resposta para alegar domínio.

| Situação | Conceito | Capacidade que ganha sentido no mundo |
|---|---|---|
| Recuperar terminal do depósito | SELECT / FROM | Consultar catálogo de peças. |
| Consertar seletor do drone | WHERE / AND | Selecionar cargas por características. |
| Organizar entregas | ORDER BY | Ordenar listas por uma prioridade explicada. |
| Reconectar dois arquivos | JOIN | Relacionar objetos, donos, pedidos e locais. |
| Reativar painel da oficina | GROUP BY / COUNT / SUM | Resumir estoque e pedidos. |
| Reutilizar uma consulta | Views, quando chegar o conteúdo | Oferecer uma consulta recorrente numa bancada. |
| Integrar instalações antigas | Sqoop, em etapa posterior | Importar dados relacionais para a infraestrutura estudada. |
| Reconectar várias ilhas | HDFS e processamento distribuído | Trabalhar armazenamento e tarefas em escala justificada. |

O manual permanece acessível. Não proibir arbitrariamente um comando já conhecido se for válido no desafio e suportado pelo executor. Não fingir suporte a comandos fora do executor escolhido.

Ajuda em camadas: pista conceitual → indicação localizada → solução comentada. Depois oferecer variação de dados para comprovar entendimento. Sem vergonha ou penalidade por pedir ajuda.

## 8. Personagens e relações

Os nomes dos quatro personagens originais ainda não foram definidos. Não renomear silenciosamente o elenco nem presumir que o usuário é o protagonista.

| Personagem | Identidade visual | Personalidade, função e vínculo |
|---|---|---|
| Protagonista | Cabelo curto cacheado, pele morena, jaqueta petróleo, calça creme, mochila de ferramentas | Técnico curioso e inventivo; personalização foi sugerida, ainda sem escopo definido. |
| Mecânica | Mulher mais velha, robusta, cabelo grisalho preso, avental ferrugem | Mentora prática, conhece as máquinas e os moradores; dicas opcionais, sem longas aulas obrigatórias. |
| Feirante | Homem esguio, boné ferrugem, camisa creme, caixa de produtos | Sociável, traz pedidos e pequenas complicações que dão vida à feira. |
| Drone | Corpo creme/petróleo, um olho âmbar, pequenas garras | Companheiro expressivo; torna resultados observáveis e erros recuperáveis. |
| Nara | Mulher negra, cabelo natural e faixa, fones e rádio portátil | Operadora curiosa; quer entender transmissões e reconectar o farol. |
| Bento | Capitão mais velho, barba grisalha, gorro ferrugem, capa creme | Calmo e experiente; conhece rotas e memórias das antigas viagens. |
| Lia | Botânica de cabelo preto curto, óculos, macacão ferrugem | Atenta e metódica; recupera a estufa e observa dados das plantas. |
| Ivo | Arquivista idoso, óculos, colete petróleo e livro/fotografias | Humor discreto; ajuda a ligar registros a histórias dos moradores. |
| Sol | Mensageira com bandana, bolsa e bicicleta de carga | Energética e solidária; conecta personagens por cartas e encomendas. |
| Teo | Técnico robusto, camisa petróleo, terminal e cabos | Paciente e prático; cuida da infraestrutura quando a rede cresce. |

Relações propostas: Sol leva cartas a Ivo; os arquivos ajudam Nara a identificar transmissões; Bento abre acesso ao local encontrado; Lia gera dados de sensores; Teo integra e processa essa rede. Nenhum personagem existe só para recitar uma sintaxe.

## 9. Cenários e mudanças persistentes propostas

| Lugar | Identidade / interação | Mudança visível ao progredir |
|---|---|---|
| Oficina e feira original | Base, bancada, estoque, encontro com mecânica e feirante | Bancadas voltam a funcionar, letreiros acendem, novas barracas abrem. |
| Farol das Frequências | Rádio, mapas, antena; Nara | Ruído dá lugar a uma transmissão compreensível; farol ilumina nova rota. |
| Doca das Marés | Barco, guindaste, cargas; Bento | Barco restaurado, novas expedições curtas, objetos recuperados. |
| Estufa da Encosta | Canteiros, irrigação, sensores; Lia | Plantas e canteiros se recuperam pelas ações, sem morrer na ausência. |
| Casa das Memórias | Arquivos, fotos, mesa de pesquisa; Ivo | Exposições se completam e moradores reconhecem objetos. |
| Praça das Entregas | Correio, escaninhos, bicicleta; Sol | Correspondências chegam e pequenos encontros aparecem. |
| Estação da Rede | Equipamentos, cabos e diagnósticos; Teo | Instalações são reconectadas e painéis passam a exibir dados coerentes. |

As pranchas mostram estudos de ambiente, não mapas finais. Planejar circulação, escala, colisões e enquadramento só ao produzir os mapas. Preservar espaços de respiro no celular.

## 10. Catálogo inicial de missões — propostas, não implementadas

Estas missões são exercícios narrativos autorais para discussão. A ordem pedagógica e os comandos devem ser confrontados com o material original antes da implementação. Uma missão visualmente interessante não justifica ensinar semântica errada.

| ID | Missão / personagem | Ação e conteúdo | Consequência proposta |
|---|---|---|---|
| OF-01 | O terminal acordou / Mecânica | Consultar nomes das peças com SELECT/FROM. | Catálogo volta a funcionar. |
| OF-02 | Uma luz para a feira / Feirante | Filtrar tipo lampada e estado funcionando com WHERE/AND. | Drone entrega duas peças e ilumina a barraca. |
| OF-03 | Primeiro o mais urgente / Sol | Ordenar pedidos pela prioridade definida e desempate estável. | Quadro de entregas organizado; introduz ORDER BY. |
| EN-01 | Cartas sem destino / Sol | Filtrar correspondências pendentes. | Abrir primeiro lote de entregas. |
| EN-02 | Quem mora aqui? / Sol e Ivo | JOIN entre destinatários e endereços. | Entrega revela fotografia antiga. |
| EN-03 | A praça se prepara / Sol | Agrupar encomendas por destino e contar. | Separar cargas para evento da praça. |
| ME-01 | O nome na fotografia / Ivo | Relacionar registros e objetos por identificadores confiáveis. | Revelar dono de um objeto recuperado. |
| ME-02 | Duas listas, uma história / Ivo | Comparar conjuntos de registros conforme dialeto estudado. | Completar uma exposição e descobrir referência ao farol. |
| FA-01 | Voz entre os ruídos / Nara | Filtrar registros de sinais por critérios explícitos. | Identificar uma transmissão relevante. |
| FA-02 | De onde vem o chamado? / Nara | JOIN entre antenas e transmissões; interpretar resultados. | Apontar uma localização para Bento. |
| DO-01 | Cabe no barco? / Bento | SUM dos pesos de um conjunto de cargas; comparar com capacidade. Não pedir resolver otimização de mochila com SQL básico. | Autorizar uma viagem planejada. |
| DO-02 | Peças do passado / Bento e Ivo | Comparar catálogo recuperado com inventário conhecido. | Trazer um objeto para a Casa das Memórias. |
| ES-01 | Canteiros com sede / Lia | Consultar leituras abaixo do limite informado. | Ativar irrigação nos canteiros selecionados pelo controlador. |
| ES-02 | O que mudou nesta semana? / Lia | Agregar leituras por canteiro em dados de exemplo. | Identificar uma falha de sensor e recuperar uma área. |
| RE-01 | O arquivo da estação / Teo | Mais adiante, configurar importação Sqoop com entrada/saída verificáveis. | Registros antigos ficam disponíveis à rede. |
| RE-02 | As ilhas conectadas / Teo | Simulação explicitamente identificada de blocos e réplicas HDFS. | Visualizar disponibilidade e replicação sem metáforas enganosas. |
| RE-03 | Um porto de sinais / Teo e Lia | MapReduce/Spark em etapa avançada, dados suficientes e regras explícitas. | Resumo de leituras de várias instalações. |
| EV-01 | A noite das lanternas / Elenco | Evento por progresso que recombina consultas já aprendidas. | Festa no cenário e encontros curtos entre moradores. |

### Contrato mínimo de uma missão implementada

Cada missão deve especificar: ID estável, pré-requisitos, personagens/local, objetivo observável, conceito e fonte, schema e dados de entrada, critérios de sucesso, soluções equivalentes, dicas graduais, solução comentada, efeito visual, recompensa e estado de retomada.

Validar o resultado sem depender só de igualdade textual do código. Verificar ordenação quando exigida, duplicatas, nulos, colunas e condições de sucesso. Não aprovar por retornar a quantidade correta de linhas com os registros errados.

### OF-02 como referência de coerência

Schema proposto: pecas(id, nome, tipo, estado). Dados: Lâmpada A funcionando; Lâmpada B quebrada; Lâmpada C funcionando, todas com tipo lampada. Acrescentar outra categoria em testes futuros para verificar o filtro de tipo.

```sql
SELECT nome
FROM pecas
WHERE tipo = 'lampada'
  AND estado = 'funcionando';
```

Resultado esperado: Lâmpada A e Lâmpada C, em qualquer ordem se ORDER BY não foi solicitado. O drone recebe os identificadores correspondentes de forma definida pelo controlador; não presumir que nomes são chaves únicas. Produção deverá especificar esse contrato de seleção.

Na prancha, a tabela nome/estado é uma prévia de entrada, não o resultado exato da consulta (que seleciona apenas nome). O brilho e as duas lâmpadas na imagem são narrativa visual, não evidência de uma execução real.

## 11. Minijogos e eventos secundários

Direções aprovadas pelo conselho de design anterior (avaliações de agentes, não playtests): bancada de drones, feira por turnos, rádio mistério, museu vivo e festival por progresso.

- Feira: poucas encomendas por rodada, consequências claras; sem cronômetro obrigatório.
- Rádio: sinais com equivalente visual/textual; pistas graduais para evitar tentativa cega.
- Museu: objetos contam histórias e provocam reações; não apenas preencher porcentagem.
- Festival: preparação em etapas curtas, salváveis; calendário interno baseado em progresso.
- Tempestade/reparo de HDFS foi discutida, mas não passou do corte médio 4/5 do conselho; não faz parte das ideias aprovadas. Qualquer retomada exige nova avaliação de escopo e fidelidade.
- Pesca arcade obrigatória e cronometrada foi rejeitada como barreira ao estudo. Não introduzir como condição para liberar aulas.

## 12. Fontes pedagógicas e cuidado com versões

Os materiais originais permanecem fora deste repositório público. No ambiente inicial estão nas pastas `Big Data` e `SQL` do workspace pai. Incluem cinco PDFs Big Data capítulos 05–09, sete DOCX de instalação/hands-on, PDFs e scripts SQL. O prompt original foi fornecido como anexo, não versionado aqui.

Requisitos herdados: usar o conteúdo fornecido, referenciar arquivo/página quando aplicável, identificar correções e diferenças de versões; não publicar credenciais. Narrativa, schemas do porto e exercícios novos são autorais e devem ser distinguidos do conteúdo original.

Pontos já encontrados, a reconferir no arquivo original quando utilizados:

- Estatísticas de Big Data antigas e projeções de 2025 devem manter data e contexto, não ser apresentadas como fatos atuais.
- Hadoop legado JobTracker/TaskTracker aparece junto de material mais recente com YARN ResourceManager/NodeManager; não misturar arquiteturas.
- Documentos têm diferenças entre Hadoop 3.2.1, Spark 3.0.0 com build Hadoop 2.7, Sqoop 1.4.7 e link de documentação 1.99.7.
- Versões de driver MySQL divergem entre documentos; correção de biblioteca não prova compatibilidade total.
- Instalações contêm comandos potencialmente destrutivos ou inadequados como remoção ampla de Java, formatação de namenode, sobrescrita de authorized_keys e recuperação MySQL com skip-grant-tables. Não executar ou transformar em passo obrigatório do jogo.
- SQL mistura conteúdo Oracle com MySQL; operadores, objetos e sintaxe devem indicar dialeto.
- Há divergências entre enunciados e gabaritos (índice em coluna diferente, aliases, tabelas, filtros, agregações com duplicatas). Não reproduzir automaticamente uma resposta conflitante.
- Alguns arquivos auxiliares citados não foram encontrados; não inventar seu conteúdo.
- Extrações locais anteriores podem colidir quando PDF e SQL têm o mesmo nome-base. Consultar o original, não tratar o texto extraído como autoridade absoluta.

### Dataset Produtos de origem — preservar quando reutilizado

```sql
CREATE DATABASE CP2;
USE CP2;
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  quantidade INT NOT NULL
);
INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES
('Camiseta', 'Camiseta de algodão, disponível em várias cores.', 29.90, 50),
('Calça Jeans', 'Calça jeans ajustada, confortável para o dia a dia.', 99.90, 30),
('Tênis Esportivo', 'Tênis ideal para corrida e atividades físicas.', 159.90, 20),
('Relógio Digital', 'Relógio digital com cronômetro e calendário.', 89.90, 15),
('Mochila', 'Mochila espaçosa, perfeita para escola ou viagens.', 79.90, 25);
```

Esse dataset não é o inventário ficcional de peças. Não trocar seus dados silenciosamente para encaixar a narrativa.

## 13. Projeto anterior, hospedagem e separação

- Aplicativo de estudo anterior: `dados-em-curso`, em pasta irmã; URL conhecida `https://dados-em-curso.vercel.app`.
- Ele continha três lições introdutórias, biblioteca de textos, oito questões de múltipla escolha, progresso local e seleção ativa. Não era o curso completo e não executava SQL real.
- Não copiar essas limitações como requisitos do novo jogo nem anunciar que Porto Sucata já está publicado naquela URL.
- O projeto Vercel "so na rede" pertence ao usuário e não pode ser alterado. O nome de equipe semelhante não deve ser confundido com autorização para modificar esse projeto.
- Nenhum alvo de deploy está configurado para este repositório. Não migrar domínio nem vincular projeto automaticamente nesta etapa documental.

## 14. Decisões em aberto

- Engine/renderização, tecnologia de UI e estratégia de distribuição.
- Executor SQL e suporte real a dialetos; simulações versus serviços para etapas distribuídas.
- Resolução base, tamanho de tiles, sprites finais, animações e projeção exata dos mapas.
- Fonte e tamanhos finais; tokens propostos precisam de validação de contraste.
- Personalização e nome do protagonista; nomes da mecânica, feirante e drone.
- Salvamento, versionamento/migração de save, backup e funcionamento offline.
- Detalhes de deslocamento por toque, editor com teclado e acessibilidade.
- Validação pedagógica de cada missão contra as fontes e ajuste da ordem de aprendizagem.
- Áudio e música originais; nenhuma faixa foi produzida/licenciada nesta etapa.

## 15. Critérios para não perder qualidade

- Comparar alterações de UI/arte com as referências, não apenas com descrições.
- Testar legibilidade a 360px de largura sem depender de zoom; controles de toque confortáveis, foco e indicação de seleção.
- Verificar estados sem seleção, selecionado, carregando/executando, ajuda, erro, sucesso, pausa e retomada conforme forem implementados.
- Nenhum resultado fingido: diferenciar desenho, demonstração local, simulação e execução real.
- Recompensa corresponde a uma capacidade ou mudança observável; aprendizagem não vira grind.
- Não sacrificar clareza do código para manter todo o cenário visível.
- Não aumentar saturação ou quantidade de painéis para transmitir progresso.
- Não declarar offline, salvamento ou correção automática antes de implementar e verificar.

## 16. Histórico de consolidação

### 2026-10-29 — Fundação documental e referências

- Motivação: pedido explícito do usuário para usar Porto-Sucata e manter contexto detalhado a cada modificação.
- Alterações: README, AGENTS, este documento, gitignore e inventário com quatro pranchas preservadas sem alteração visual.
- Decisões preservadas: visual aprovado, cores contidas, câmera proposta, hierarquia de telas, single player/mobile, progresso constante e correção honesta.
- Complementos propostos: catálogo de 18 missões, relações do elenco e tokens preliminares de UI; identificados como propostas.
- Verificação realizada: todos os links relativos dos Markdown apontam para arquivos existentes; as quatro imagens copiadas têm SHA-256 idêntico aos originais; dimensões, tamanho e hashes foram registrados em `art/references/manifest.json`. Documentação revisada quanto à separação entre conceitos e implementação. Não há testes de gameplay aplicáveis nesta etapa documental.
- Limitações: sem jogo implementado, sem deploy e sem sprites prontos. Conector GitHub recusou escrita por permissão da integração; o Git local foi usado para preparar o repositório. O histórico Git remoto é a referência para confirmar a publicação desta revisão.
