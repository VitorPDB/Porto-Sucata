# Referências de arte — Porto Sucata

Estas quatro imagens foram geradas nesta conversa com a ferramenta integrada de geração de imagens e preservadas sem edição. São conceitos originais de personagens, ambientes e painéis, não assets recortados de jogos existentes nem sprites prontos para produção.

## Inventário

| Arquivo versionado | Original da geração | Status |
|---|---|---|
| `01-elenco-original-camera.png` | `exec-fcd6ad2c-2906-4b3b-a32e-6df35d1d0a42.png` | Usuário aprovou explicitamente personagens/estilo: "Assim está ótimo". |
| `02-gameplay-paineis.png` | `exec-a43e613a-18ee-48d8-b824-2de055c1934f.png` | Direção de gameplay apresentada; usuário pediu expansão em seguida. Não confundir com aprovação individual de todos os controles. |
| `03-moradores-do-porto.png` | `exec-ec0032e8-c846-494e-a92d-fd0abe2a7660.png` | Expansão visual recebeu "curti vei" juntamente com cenários. |
| `04-cenarios-do-porto.png` | `exec-f2d05ae1-cc8f-4380-9a33-ad395402d56b.png` | Expansão visual recebida positivamente; mapas jogáveis ainda não produzidos. |

## Briefs de geração preservados em resumo

1. **Elenco original e câmera:** prancha de pixel art, técnico cacheado com jaqueta petróleo/mochila, mecânica grisalha de avental ferrugem, feirante com caixa e drone de olho âmbar; miniaturas frente/costas e oficina costeira em vista superior inclinada; creme, petróleo, ferrugem e âmbar.
2. **Painéis de gameplay:** três telas verticais consecutivas da missão de lâmpadas: exploração, terminal SQL e resultado no mundo; identidade da prancha original, botões grandes, abas Pedido/Código/Dados, texto legível e mundo pausado no editor.
3. **Novos moradores:** seis personagens com silhuetas distintas e miniaturas: Nara/radiooperadora, Bento/capitão, Lia/botânica, Ivo/arquivista, Sol/mensageira, Teo/técnico de rede. Mesmo estilo do elenco original.
4. **Cenários:** seis vinhetas de farol, doca, estufa, arquivo, praça postal e estação de rede; elenco correspondente e protagonista/drone; locais conectados à mesma cidade costeira, espaços de interação e luz acolhedora.

Os briefs acima são resumos editoriais, não transcrições integrais dos prompts. Não alegar reprodução exata por prompt ou seed.

## Regras para futuras versões

- Ver `CONTEXTO_DO_PROJETO.md` antes de criar ou alterar arte.
- Preservar estas imagens originais. Nova variante recebe sufixo de versão, novo status e registro no contexto.
- Observar o pedido posterior do usuário de evitar cores muito vibrantes.
- Na implementação, reduzir densidade e adaptar enquadramento sem perder materiais, silhuetas e atmosfera.
- Não usar a prancha inteira como substituto de cenário navegável ou de sistema de personagens.
- Não tratar texto gerado na imagem como fonte de verdade para sintaxe/resultado SQL.
- A primeira missão agora usa um cenário e uma folha transparente de poses produzidos separadamente em `public/art/`, com prompts em `public/art/provenance.json`. As pranchas desta pasta continuam sendo referência, não os assets recortados do jogo. Não há frames de caminhada direcional, tileset ou áudio.

`manifest.json` registra dimensões, tamanho e SHA-256 das cópias versionadas para conferir integridade.
