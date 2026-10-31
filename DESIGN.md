---
name: Porto Sucata
description: Um cais acolhedor de pixel art, com uma bancada de código legível.
colors:
  paper: "#f3ebdd"
  ink: "#263c3a"
  teal: "#294b48"
  rust: "#87563e"
  amber: "#b58a4d"
  line: "#c8c0b0"
  soft: "#e6dfd1"
  muted: "#59635a"
  canvas: "#e5dfd2"
  editor: "#faf6ec"
  success: "#285441"
  error: "#843d2b"
typography:
  display:
    fontFamily: "Fraunces, serif"
    fontSize: "clamp(23px, 2.6vw, 30px)"
    fontWeight: 600
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, serif"
    fontSize: "27px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  code:
    fontFamily: "Consolas, Courier New, monospace"
    fontSize: "16px"
    lineHeight: 1.7
rounded:
  label: "3px"
  chip: "4px"
  control: "5px"
  icon: "6px"
  shell: "9px"
spacing:
  tight: "5px"
  small: "8px"
  control: "12px"
  regular: "16px"
  mobile-panel: "20px"
  desktop-panel: "28px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 17px"
    width: "100%"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 17px"
  editor:
    backgroundColor: "{colors.editor}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
    padding: "15px 12px"
---

# Design System: Porto Sucata

## Overview

**Creative North Star: "Uma oficina acolhedora no cais"**

Registro da extensão de expedição em 31/10/2026, extraído de `src/style.css`, `src/expedition.css`, `src/main.js`, `src/mission.js` e `src/expedition.js`. A expressão acima resume a direção já estabelecida; não é uma nova proposta de identidade. Madeira, metal reaproveitado, pedra e lona formam um mundo pixelado em cores contidas. A interface creme dá espaço ao texto e às ações.

O elenco e a atmosfera derivam das pranchas preservadas em `art/references/01-elenco-original-camera.png`, `02-gameplay-paineis.png`, `03-moradores-do-porto.png` e `04-cenarios-do-porto.png`. As pranchas são conceitos; o jogo usa `public/art/cais-oficina.png` e `public/art/elenco-sprites.png`, com o novo fundo `public/art/deposito-luminarias.png`. Procedência: `public/art/provenance.json`. As poses são estáticas e independentes do fundo; não há caminhada livre ou direcional, tileset, áudio ou mapa amplo. A expedição prolonga a identidade aprovada: pedido do dia → depósito → investigação → consulta → scanner → carga → retorno e instalação.

**Key Characteristics:**
- Pixel art contida no mundo, tipografia limpa na interface.
- Creme e petróleo dominantes, ferrugem discreta e luz âmbar pontual.
- Seleção identificável por texto, contorno e marcas, além da cor.
- Exploração, bancada e consequência com hierarquias próprias.

## Colors

Os tokens do frontmatter registram a implementação, substituindo nesta especificação os valores preliminares de UI do contexto.

### Primary
- **Petróleo do cais — teal:** ações principais, aba ativa, hotspots investigados e console do scanner.
- **Creme de papel — paper:** superfícies e texto sobre petróleo.

### Secondary
- **Ferrugem discreta — rust:** ícones de objetivo/inspeção e foco de controles. O valor implementado é mais escuro que a proposta preliminar do contexto.
- **Âmbar contido — amber:** variável declarada; a iluminação efetiva usa uma variação local (`#e0b870`), com opacidade final `.85` e desfoque de `9px`.

### Neutral
- **Tinta do porto — ink:** texto principal.
- **Papel sombreado — soft:** cabeçalhos de tabelas, código de ajuda e navegação atual.
- **Linha de papel — line:** separação estrutural fina.
- **Verde acinzentado — muted:** explicações, metadados e ações secundárias.
- **Canvas:** fundo externo; **editor:** campo de SQL; **success/error:** títulos de feedback acompanhados de explicação textual.

**The Muted Harbor Rule.** Preserve as cores contidas; não introduza neon, arco-íris ou grandes superfícies muito saturadas.

## Typography

**Display Font:** Fraunces, serif (600). **Body Font:** DM Sans, sans-serif (400/500/600). **Label/Mono Font:** Consolas, Courier New, monospace; chips usam Consolas, monospace.

Fraunces e DM Sans são importadas localmente por `@fontsource` em `src/main.js`. Os títulos têm caráter acolhedor; comandos permanecem texto selecionável e editável.

### Hierarchy
- Objetivo: display do frontmatter; no celular fica em `23px`.
- Título de painel: headline; no celular `25px`, ou `24px` no nome do interlocutor.
- Subtítulo: title. Corpo: body. Fala: `19px/1.65`, reduzida a `16px/1.55` no celular.
- Botões e abas: `14px`; metadados geralmente `11–14px`; rótulos do mundo chegam a `10px` no celular.
- SQL: code; ajuda em bloco usa `14px/1.6`. Não há realce sintático ou fonte pixelada no editor.

**The Readable Code Rule.** Preserve o editor em 16px e deixe o cenário recolher antes de comprimir a escrita.

## Layout

Desktop: contêiner central de até `1120px`, padding `0 28px 24px`; cabeçalho mínimo `88px`. Objetivo usa `22px 26px`. Grade de duas colunas `minmax(0, 1.22fr) minmax(340px, 1fr)`; painel com `28px`. Mundo sticky no topo, com proporção `3/4`.

O único corte responsivo é `max-width: 899px` (JavaScript usa `innerWidth < 900`). Nesse intervalo o contêiner tem até `520px`, cabeçalho mínimo `65px`, objetivo com `18px`, painel com `20px` e layout empilhado. A viewport do mundo passa a `12/13`, mas o plano interno continua `3/4`: recorta a parte inferior sem deformar cenário e coordenadas. Corpo tem largura mínima `320px`. Não há promessa de caber sem rolagem vertical.

No terminal e no scanner móveis o mundo fica oculto; o editor e a operação recebem prioridade. O antigo botão “Ver o cais e a seleção” foi removido. Transições relevantes focam o título do painel e rolam até ele no celular; viagem e instalação retornam ao topo. Navegação inferior pertence ao fluxo e respeita safe area, não é barra fixa. Tabelas rolam dentro de área de até `300px` de altura.

Hierarquia: mundo/objetivo/ação contextual na exploração; pedido/código/dados/ação na bancada; efeito/explicação/recompensa no resultado. Pedido, Código e Dados são abas, com Código inicialmente ativo. Pedido, destino, investigação, operação, carga, conferência e conclusão reutilizam o mesmo painel.

## Elevation & Depth

Superfícies predominantemente planas, separadas por tom e borda. A sombra ativa é a do modal (`0 16px 60px #132a2850`). A antiga sombra das peças sobre o cenário permanece no CSS legado, mas esses controles não são renderizados. O backdrop do modal é `#142c2aab`. Não há blur no painel; o blur pertence somente à iluminação do mundo.

## Shapes

Cantos suavemente retangulares conforme frontmatter; bordas de interface geralmente `1px`, peças `2px`. Indicadores de instalação e luzes são circulares; o scanner usa faixa retangular e cursor linear. Sprites preservam pixels com `image-rendering: pixelated`, quatro poses numa folha horizontal com background-size `400% 100%`. Cenário e sprites aplicam `saturate(.65)` em CSS; os arquivos originais permanecem preservados.

## Components

### Buttons

Controles diretos, com altura mínima `46px`, gap `9px` e peso 600. Primário ocupa a largura; hover petróleo escuro `#203d3b`. Secundário transparente recebe hover `#e5dece`. Ação textual tem borda transparente, peso 500 e sublinhado no hover. Botões de ícone são `44×44px`. Desabilitado usa opacidade `.6` e cursor wait. Não existe estilo especial de pressão `:active`.

Foco de botões, links, summary, input e textarea: contorno ferrugem `3px`, afastado `4px`. Hotspots são botões e recebem o mesmo foco; o fundo do mundo não é um controle de caminhada.

### Controles removidos

Chips de inserção SQL, Desfazer, seleção manual de peças sobre o mundo, bancada clicável, conversas clicáveis dos moradores e atalho de conquista sobre o cenário não integram a expedição atual. Seus seletores remanescentes no CSS não documentam funcionalidades presentes. Pistas e a solução de exemplo continuam disponíveis no painel.

### Cards / Containers

Não há grade de cards. Objetivo, mundo e painel formam uma superfície contínua; extremos externos recebem raio shell no desktop e ficam retos no celular. Modal nativo mede `min(94vw, 510px)`, máximo `88dvh`; conteúdo tem padding `62px 28px 28px`, ou `62px 23px 23px` móvel, reservando espaço ao fechamento.

### Inputs / Fields

Textarea de largura total, mínimo `162px`, redimensionável verticalmente, borda `#a7ac9d`, caret petróleo e foco compartilhado. Durante consulta fica readonly e os botões de ação ficam desabilitados. Erro aparece abaixo com `role=alert` e explicação, preservando o rascunho. “Preparar varredura” executa SQLite real e guarda o resultado antes do scanner; a tabela de resultados aparece após as duas etapas. Não há ação direta “Enviar drone”.

### Navigation

Abas de mínimo `44px`, seleção com preenchimento petróleo, peso 600 e `aria-selected`; setas/Home/End movem a aba. Navegação Expedição/Diário/Manual usa `aria-current=page`, fundo soft e peso 600 para a atual. Não há hover específico nas abas/nav além do foco visível.

### Cenas e hotspots

O cais apresenta moradores em poses estáticas; a viagem troca o fundo pelo depósito. “Registros” e “Investigar lote” são hotspots nomeados de altura mínima `44px`, borda ferrugem de `2px`, raio `4px` e fundo creme. Investigados, ficam petróleo com borda clara e marca ✓; ficam desabilitados fora da exploração. O jogador muda entre posições predefinidas por ação: não há joystick, caminhada livre ou clique para andar. A carga aparece como quantidade junto ao drone e como nomes no painel.

### Scanner

Console petróleo com padding `20px`, raio `4px` e margem vertical `22px`. Medidor de `76px` com fundo escuro, faixa ferrugem contornada e cursor creme de `4px`; texto e botões descrevem a operação. Duas fases: “Sintonizar o lote” (faixa 28–58%, travessia de 2400ms) e “Estabilizar a leitura” (61–83%, 1800ms). Iniciar leitura e Fixar sinal controlam o cursor oscilante. Errar permite repetir sem perder a fase anterior ou peças. O resultado continua sendo exatamente o da consulta, mesmo quando incorreto.

“Scanner sem tempo · mesma recompensa” fica nas opções de pausa e troca a operação por “Confirmar sinal” em cada fase. Redução de movimento também ativa essa alternativa. O modo não altera carga, progresso ou recompensa. Mensagens do scanner usam `role=status`; abrir modal ou ocultar a aba interrompe a leitura, que exige reinício explícito.

### Pedido do dia, retorno e persistência

O Dia 1 avança por ações, sem contagem regressiva. Após aceitar o pedido, investigar o lote e consultar, só é possível recolher resultados com IDs reconhecidos e sem duplicação após as duas fases do scanner. Uma carga incorreta pode ser recuperada, mas a oficina valida novamente no retorno: apenas as lâmpadas A e C permitem instalar e encerrar o dia. Vazio, lâmpada quebrada ou rádio geram explicação e retorno ao depósito; timing não corrige SQL.

Instalação é uma sequência textual de duas etapas de `1800ms` (`700ms` com movimento reduzido), pausada por modal ou aba oculta. O drone não interpola o antigo percurso; muda de posição na conclusão. Luzes usam transição de opacidade de `1.2s`. A preferência do sistema desativa transições CSS, e a opção salva também desativa transições de jogador/luz. A conclusão mantém iluminação, explica ORDER BY e oferece repetir a expedição preservando a conquista.

Progresso usa `porto-sucata:save:v2`: rascunho, descoberta, pistas, carga e checkpoint do scanner persistem localmente. A migração de v1 preserva rascunho e conquista; partidas antigas incompletas voltam ao pedido inicial, concluídas à conclusão. Não há conta, sincronização ou offline garantido; só OF-02/Dia 1 está implementado, sem calendário de missões recorrentes. SQL é SQLite real, somente leitura; não anunciar suporte completo a MySQL/Oracle.

## Do's and Don'ts

### Do:
- **Do** preservar elenco, materiais e paleta das referências existentes.
- **Do** manter código legível e recolher o mundo na bancada móvel.
- **Do** acompanhar seleção, erro e sucesso com texto ou marcas explícitas.
- **Do** comparar mudanças com as capturas e com a implementação atual.

### Don't:
- **Don't** aumentar saturação para sinalizar progresso.
- **Don't** substituir mundo interativo por uma prancha conceitual.
- **Don't** anunciar animação direcional, campanha ou suporte SQL não implementados.
- **Don't** apagar rascunho ou conquistas após uma tentativa incorreta.

.impeccable/review/expedition-desktop.png, depot-mobile.png e scanner-mobile.png foram consultadas para esta extensão. Capturas complementares da expedição: depot-desktop.png e terminal-mobile.png. Evidência histórica: `.impeccable/review/desktop.png` e `mobile-terminal.png`. Capturas complementares preservadas: `mobile.png`, `user-360.png`, `mobile-complete.png`, `desktop-terminal.png`, `desktop-complete.png` e `mobile-merchant.png`. Este documento registra o CSS e os estados implementados; não substitui teste de usabilidade nem certificação de acessibilidade.
