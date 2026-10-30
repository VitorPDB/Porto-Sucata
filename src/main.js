import '@fontsource/fraunces/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './style.css';
import { PARTS, HINTS, SOLUTION_SQL, assessResult, initialState, loadSave, writeSave } from './mission.js';
import { runSQL } from './sql-client.js';
import { icon } from './icons.js';

const app = document.querySelector('#app');
let storage;
try { storage = window.localStorage; } catch { storage = null; }
let state = loadSave(storage);
let tab = 'code';
let modal = null;
let selectedPart = null;
let result = null;
let assessment = null;
let error = '';
let busy = false;
let saveOK = true;
let previousCode = state.code;
let selection = 'mechanic';
let talk = 'mechanic';
let deliveryProgress = 0;
let lastFrame = 0;
let pausedByVisibility = document.hidden;
let lastFocused = null;
let showBenchWorld = false;
const reduced = () => state.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const formatCell = value => value === null ? 'NULL' : String(value);
function persist() { saveOK = writeSave(storage, state); }
function announce(text) { const live = document.querySelector('#announcer'); if (live) live.textContent = text; }
function button(action, label, type = 'secondary', glyph = '') {
  return `<button type="button" data-action="${action}" class="button ${type}">${glyph ? icon(glyph) : ''}${label}</button>`;
}
function sprite(kind, className = '') { return `<span class="sprite sprite-${kind} ${className}" aria-hidden="true"></span>`; }
function heading(text, sub = '') { return `<div class="panel-heading"><h2 tabindex="-1">${text}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`; }

function world() {
  const selected = assessment?.ids ?? [];
  return `<section class="world-wrap" aria-label="Cais da oficina">
    <div class="world-caption"><span>${icon('anchor')} Cais da oficina</span><span>${state.stage === 'bench' || modal ? 'Mundo pausado' : state.completed ? 'A feira está aberta' : 'Fim de tarde'}</span></div>
    <div class="world ${state.completed ? 'lit' : ''} ${reduced() ? 'reduced' : ''}" id="world" tabindex="0" role="group" aria-label="Pátio. Use as setas para caminhar ou Tab para escolher uma interação."><div class="world-plane">
      <img class="scene" src="/art/cais-oficina.png" alt="Pátio de pedra entre uma oficina e uma barraca no cais. O mar fica ao sul." fetchpriority="high">
      <div class="lamp lamp-left" aria-hidden="true"></div><div class="lamp lamp-right" aria-hidden="true"></div>
      <button class="hotspot bench ${selection === 'bench' ? 'selected' : ''}" data-action="bench" aria-label="Ir até a bancada" ${busy || state.stage === 'delivery' ? 'disabled' : ''}><span>${icon('wrench')} Bancada</span></button>
      <button class="actor mechanic ${selection === 'mechanic' ? 'selected' : ''}" data-action="mechanic" aria-label="Conversar com a mecânica" ${state.stage === 'delivery' ? 'disabled' : ''}>${sprite('mechanic')}<span class="actor-name">Mecânica</span></button>
      <button class="actor merchant ${selection === 'merchant' ? 'selected' : ''}" data-action="merchant" aria-label="Conversar com o feirante" ${state.stage === 'delivery' ? 'disabled' : ''}>${sprite('merchant')}<span class="actor-name">Feirante</span></button>
      <div class="actor player" id="player" style="left:${state.position.x}%;top:${state.position.y}%">${sprite('player')}<span class="sr-only">Você</span></div>
      <div class="actor drone" id="drone" style="left:${state.completed ? 68 : 65}%;top:${state.completed ? 47 : 76}%">${sprite('drone')}<span class="cargo" ${state.stage === 'delivery' ? '' : 'hidden'}>${icon('bulb')} ×2</span></div>
      <div class="parts-on-world" aria-label="Peças na bancada">${PARTS.map(p => `<button class="world-part ${selected.includes(p.id) ? 'chosen' : ''}" data-part="${p.id}" aria-label="Inspecionar ${p.nome}${selected.includes(p.id) ? ', selecionada' : ''}" aria-pressed="${selected.includes(p.id)}" ${state.stage === 'delivery' ? 'disabled' : ''}>${icon(p.tipo === 'radio' ? 'radio' : 'bulb')}<span>${p.id === 4 ? 'Rádio' : p.nome.slice(-1)}</span>${selected.includes(p.id) ? `<span class="part-tick">${icon('check')}</span>` : ''}</button>`).join('')}</div>
      </div>${state.stage === 'complete' ? `<button class="world-completion" data-action="view-result">${icon('check')}Feira iluminada! <span>Ver conquista ${icon('arrow')}</span></button>` : ''}<span class="world-tip">${state.stage === 'delivery' ? 'O drone está levando as peças' : state.stage === 'bench' ? 'Sua seleção aparece aqui' : 'Toque no chão para caminhar'}</span>
    </div>
  </section>`;
}

function dialogue() {
  const merchant = talk === 'merchant';
  const completed = state.completed;
  const name = merchant ? 'Feirante' : 'Mecânica';
  const line = completed ? (merchant ? 'Agora dá para abrir a barraca! A primeira noite da feira é por nossa conta.' : 'Viu só? Duas condições, duas peças certas. O porto já está diferente.') : merchant ? 'Está tudo pronto para a feira… menos a luz. Duas lâmpadas funcionando resolvem.' : 'O drone está pronto. Só falta ensinar a ele quais peças levar. Vamos olhar o catálogo?';
  return `<div class="dialogue"><div class="speaker">${sprite(merchant ? 'merchant' : 'mechanic')}<div><span>Uma conversa no cais</span><h2 tabindex="-1">${name}</h2></div></div><p class="speech">${line}</p>
    ${button('open-bench', completed ? 'Voltar à bancada' : 'Usar bancada', 'primary', 'arrow')}
    <p class="quiet">${completed ? 'Você pode testar outras consultas sem perder a conquista.' : 'Sem pressa. Você pode sair e continuar depois.'}</p></div>`;
}

function dataTable(data = { columns: ['id', 'nome', 'tipo', 'estado'], values: PARTS.map(p => [p.id, p.nome, p.tipo, p.estado]) }) {
  return `<div class="table-scroll"><table><thead><tr>${data.columns.map(c => `<th scope="col">${escapeHTML(c)}</th>`).join('')}</tr></thead><tbody>${data.values.length ? data.values.map(row => `<tr>${row.map(v => `<td>${escapeHTML(formatCell(v))}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${Math.max(1, data.columns.length)}">Nenhuma linha retornada.</td></tr>`}</tbody></table></div>`;
}

function terminal() {
  return `${heading('Bancada do drone', 'Escolha as peças. Observe o que sua consulta faz.')}<button class="button text-button scene-toggle" data-action="toggle-scene" aria-expanded="${showBenchWorld}">${icon('anchor')}${showBenchWorld ? 'Recolher o cais' : 'Ver o cais e a seleção'}</button>
    <div class="tabs" role="tablist" aria-label="Bancada">${[['request', 'Pedido'], ['code', 'Código'], ['data', 'Dados']].map(([id, label]) => `<button id="tab-${id}" role="tab" aria-selected="${tab === id}" aria-controls="panel-${id}" tabindex="${tab === id ? '0' : '-1'}" data-tab="${id}">${label}</button>`).join('')}</div>
    <section id="panel-${tab}" role="tabpanel" aria-labelledby="tab-${tab}">
    ${tab === 'request' ? `<h3>Duas lâmpadas para a feira</h3><p>Selecione <strong>apenas as lâmpadas funcionando</strong>. O drone precisa da coluna <code>id</code> para encontrar cada peça; inclua <code>nome</code> para ler o resultado.</p><p>A Lâmpada B está quebrada. O rádio funciona, mas não serve para iluminar a barraca.</p>${button('show-code', 'Montar a consulta', 'primary', 'arrow')}<details><summary>Por que escrever código?</summary><p>Hoje são quatro peças. Um filtro também funciona quando o catálogo cresce. Você descreve uma regra; o banco encontra os registros.</p></details>` : ''}
    ${tab === 'data' ? `<h3>Catálogo · tabela pecas</h3><p class="quiet">Dados de entrada. Toque numa peça do cenário para inspecioná-la.</p>${dataTable()}<p class="technical-note">Exercício autoral do Porto Sucata. <code>id</code> identifica uma peça; <code>tipo</code> e <code>estado</code> descrevem suas características.</p>${button('show-code', 'Voltar ao código', 'secondary', 'back')}` : ''}
    ${tab === 'code' ? `<label class="editor-label" for="sql">Sua consulta <span>SQLite local · somente leitura</span></label>
      <textarea id="sql" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="6000" aria-describedby="sql-help" ${busy ? 'readonly' : ''}>${escapeHTML(state.code)}</textarea>
      <div class="code-tools"><div class="chips" aria-label="Inserir no código">${['WHERE', 'AND', 'tipo', 'estado', "'lampada'", "'funcionando'"].map(t => `<button data-token="${escapeHTML(t)}" ${busy ? 'disabled' : ''}>${escapeHTML(t)}</button>`).join('')}</div><button class="icon-button" data-action="undo" aria-label="Desfazer última edição" ${busy ? 'disabled' : ''}>${icon('undo')}</button></div>
      <p id="sql-help" class="quiet">SELECT escolhe colunas. WHERE filtra peças.</p>
      <button class="button primary" data-action="run" ${busy ? 'disabled' : ''}>${icon('play')}${busy ? 'Consultando o catálogo…' : 'Testar seleção'}</button>
      ${error ? `<div class="feedback error" role="alert"><h3>Vamos ajustar a consulta</h3><p>${escapeHTML(error)}</p></div>` : ''}
      ${assessment ? `<div class="feedback ${assessment.ok ? 'success' : ''}" role="status"><h3>${assessment.ok ? 'Pronto para levar!' : 'Veja o que foi selecionado'}</h3><p>${escapeHTML(assessment.message)}</p><div class="selected-parts">${assessment.ids.map(id => `<span>${escapeHTML(PARTS.find(p => p.id === id).nome)}</span>`).join('') || '<span>Nenhuma peça</span>'}</div>
      ${assessment.ok ? button('deliver', state.completed ? 'Repetir a entrega' : 'Enviar drone', 'primary', 'arrow') : button('adjust', 'Ajustar consulta', 'secondary', 'back')}
      <details><summary>Resultado da consulta · ${result.values.length} linhas</summary>${dataTable(result)}</details></div>` : ''}
      <div class="hint-area">${button('hint', state.hint ? 'Outra pista' : 'Pedir uma pista', 'text-button', 'bulb')}${state.hint ? `<p>${HINTS[state.hint - 1]}</p>` : ''}${state.hint === 3 ? `<pre><code>${escapeHTML(SOLUTION_SQL)}</code></pre>${button('use-solution', 'Experimentar esta solução')}` : ''}</div>` : ''}
    </section>
    <button class="button text-button return-world" data-action="back-world">${icon('back')}Voltar ao cais</button>`;
}

function panel() {
  if (selectedPart !== null) {
    const part = PARTS.find(p => p.id === selectedPart);
    return `<div class="inspect-panel">${heading(part.nome, 'Peça do catálogo')}<div class="inspect-icon">${icon(part.tipo === 'radio' ? 'radio' : 'bulb')}</div><dl><div><dt>id</dt><dd>${part.id}</dd></div><div><dt>tipo</dt><dd>${part.tipo}</dd></div><div><dt>estado</dt><dd>${part.estado}</dd></div></dl><p>${part.id === 2 ? 'O filamento está partido. O drone pode carregar esta peça, mas ela não vai iluminar a feira.' : part.id === 4 ? 'O rádio ainda recebe sinais. Vamos guardá-lo para outra ocasião.' : 'Esta lâmpada acende. É uma das peças que a feira precisa.'}</p>${button('close-part', state.stage === 'bench' ? 'Voltar à consulta' : 'Voltar ao cais', 'primary', 'back')}</div>`;
  }
  if (state.stage === 'bench') return terminal();
  if (state.stage === 'delivery') return `<div class="delivery-panel">${heading('Deixe com o drone', 'Sua consulta virou uma seleção de peças.')}<ol class="delivery-steps"><li class="done">Consulta verificada</li><li class="${state.deliveryStep > 0 ? 'done' : 'active'}">Recolher Lâmpadas A e C</li><li class="${state.deliveryStep > 1 ? 'done' : state.deliveryStep === 1 ? 'active' : ''}">Levar para a barraca</li></ol><p>O controlador do drone usa os IDs retornados pelo banco para encontrar e transportar as peças.</p>${button('pause', 'Pausar entrega', 'secondary', 'pause')}</div>`;
  if (state.stage === 'complete') return `<div class="completion">${icon('bulb')}${heading('Feira iluminada!', 'Duas peças certas. Um pedacinho do porto de volta à vida.')}<p>Seu filtro encontrou as lâmpadas A e C. A peça quebrada e o rádio ficaram na oficina.</p><div class="reward">${icon('book')}<div><strong>Ferramenta descoberta: ORDER BY</strong><span>Aprenda a ordenar resultados no Manual.</span></div></div><div class="completion-actions">${button('continue', 'Passear pelo cais', 'primary', 'arrow')}${button('open-bench', 'Ver minha consulta')}${button('manual', 'Conhecer ORDER BY', 'text-button')}</div><p class="quiet">Primeira missão concluída. Outras áreas ainda estão em construção.</p></div>`;
  return dialogue();
}

function overlay() {
  let content = '';
  if (modal === 'pause') content = `${heading('Um descanso no cais', 'O mundo está pausado. Continue quando quiser.')}<p>${saveOK ? 'Seu progresso e sua consulta estão salvos neste navegador.' : 'O navegador não permitiu salvar. Mantenha esta página aberta para preservar esta sessão.'}</p><label class="check-field"><input type="checkbox" id="motion" ${state.reducedMotion ? 'checked' : ''}> Reduzir movimentos</label>${button('close-modal', 'Continuar jogando', 'primary', 'play')}<details><summary>Sobre esta versão</summary><p>Uma missão jogável, sem conta. O progresso fica apenas neste navegador e pode ser perdido ao limpar seus dados. Ainda não há sincronização ou modo offline garantido.</p></details>`;
  if (modal === 'journal') content = `${heading('Diário do cais', 'Suas pequenas mudanças ficam por aqui.')}<div class="journal-entry"><span class="journal-status">${state.completed ? 'Concluída' : 'Em andamento'}</span><h3>Uma luz para a feira</h3><p>${state.completed ? 'O drone entregou duas lâmpadas funcionando. A barraca está iluminada.' : 'A mecânica precisa separar duas lâmpadas para a barraca do feirante.'}</p><ul><li>${state.stage === 'intro' ? 'Conhecer' : 'Conheceu'} a oficina</li><li>${state.inspected.length} de 4 peças inspecionadas</li><li>${state.completed ? 'Entrega concluída' : 'Entrega aguardando sua consulta'}</li></ul></div><p class="quiet">Farol, estufa e novas histórias ainda não estão disponíveis nesta versão.</p>${button('close-modal', 'Voltar ao jogo', 'primary')}`;
  if (modal === 'manual') content = `${heading('Caderno de ferramentas', 'Consulte à vontade. Não há penalidade por aprender.')}<h3>Ler e filtrar</h3><dl class="manual-list"><div><dt>SELECT id, nome</dt><dd>Escolhe as colunas retornadas.</dd></div><div><dt>FROM pecas</dt><dd>Escolhe a tabela consultada.</dd></div><div><dt>WHERE tipo = 'lampada'</dt><dd>Mantém as linhas em que a condição é verdadeira.</dd></div><div><dt>AND estado = 'funcionando'</dt><dd>Exige que a segunda condição também seja verdadeira.</dd></div></dl><h3>Ordenar com ORDER BY</h3><p>Acrescente ao fim da consulta, antes do ponto e vírgula, para ordenar pelos nomes:</p><pre><code>ORDER BY nome ASC;</code></pre><p>ASC é crescente; DESC é decrescente. Ordenar não muda quais peças passam pelo filtro.</p><p class="technical-note">Este capítulo executa SQLite no navegador. Os conceitos introdutórios são compartilhados com MySQL, mas não representam suporte completo ao dialeto MySQL ou Oracle. Dados e missão são autorais.</p>${button('close-modal', 'Voltar ao jogo', 'primary')}`;
  return `<dialog id="overlay" aria-label="${modal === 'pause' ? 'Pausa' : modal === 'manual' ? 'Manual' : 'Diário'}"><button class="icon-button close-dialog" data-action="close-modal" aria-label="Fechar painel">${icon('close')}</button><div class="overlay-content">${content}</div></dialog>`;
}

function render(focusTarget) {
  app.innerHTML = `<div class="game-shell ${state.stage === 'bench' ? 'bench-mode' : ''} ${showBenchWorld ? 'show-bench-world' : ''}">
    <header class="game-header"><a class="brand" href="#" data-action="home">${icon('anchor')}<span>Porto Sucata</span></a><div class="header-tools"><span class="save-state ${!saveOK ? 'save-error' : ''}">${saveOK ? 'Progresso local' : 'Não foi possível salvar'}</span><button class="icon-button" data-action="pause" aria-label="Pausar jogo">${icon('pause')}</button></div></header>
    <div class="objective"><div>${icon(state.completed ? 'check' : 'bulb')}<div><h1>Uma luz para a feira</h1><p>${state.completed ? 'A feira voltou a brilhar. Obrigado por ajudar.' : 'Encontre duas lâmpadas funcionando.'}</p></div></div><span class="chapter-label">Primeira missão</span></div>
    <main class="game-layout">${world()}<section class="interaction-panel" id="interaction" aria-label="Interação atual">${panel()}</section></main>
    <nav class="bottom-nav" aria-label="Navegação do porto"><button data-action="home" ${!modal ? 'aria-current="page"' : ''}>${icon('anchor')}Oficina</button><button data-action="journal" ${modal === 'journal' ? 'aria-current="page"' : ''}>${icon('notebook')}Diário</button><button data-action="manual" ${modal === 'manual' ? 'aria-current="page"' : ''}>${icon('book')}Manual</button></nav>
    <div id="announcer" class="sr-only" aria-live="polite"></div>${modal ? overlay() : ''}</div>`;
  if (modal) {
    const dialog = document.querySelector('#overlay');
    dialog.showModal();
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
  } else if (focusTarget) document.querySelector(focusTarget)?.focus({ preventScroll: true });
  updateActors();
}
function openModal(name) { lastFocused = document.activeElement?.dataset.action || null; modal = name; render(); }
function closeModal() { modal = null; lastFrame = 0; render(lastFocused ? `[data-action="${lastFocused}"]` : undefined); }
function focusPanel() { document.querySelector('#interaction h2')?.focus({ preventScroll: true }); if (innerWidth < 900) document.querySelector('#interaction')?.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'start' }); }
function openBench() {
  if (busy || state.stage === 'delivery') return;
  state.stage = 'bench'; state.position = { x: 34, y: 46 }; selection = 'bench'; selectedPart = null; tab = 'code'; persist(); render(); focusPanel();
}
function invalidate() { result = null; assessment = null; error = ''; }
function setCode(code) { previousCode = state.code; state.code = code; invalidate(); persist(); }

app.addEventListener('input', event => {
  if (event.target.id !== 'sql') return;
  previousCode = state.code; state.code = event.target.value; invalidate(); persist();
  // Keep the native textarea and selection intact during typing.
  app.querySelector('.feedback')?.remove();
  for (const part of app.querySelectorAll('.world-part')) { part.classList.remove('chosen'); part.setAttribute('aria-pressed', 'false'); part.querySelector('.part-tick')?.remove(); }
  const label = app.querySelector('.save-state'); label.textContent = saveOK ? 'Progresso local' : 'Não foi possível salvar';
});
app.addEventListener('change', event => {
  if (event.target.id === 'motion') { state.reducedMotion = event.target.checked; persist(); app.querySelector('.world')?.classList.toggle('reduced', reduced()); }
});
app.addEventListener('keydown', event => {
  const target = event.target;
  if (target.matches('[role="tab"]') && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    event.preventDefault(); const tabs = ['request', 'code', 'data']; const i = tabs.indexOf(tab);
    tab = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[2] : tabs[(i + (event.key === 'ArrowRight' ? 1 : 2)) % 3]; render(`#tab-${tab}`);
  }
  if (target.id === 'sql' && (event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); execute(); }
  if (target.id === 'world' && !modal && ['intro', 'explore', 'complete'].includes(state.stage) && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    state.position.x = Math.max(18, Math.min(82, state.position.x + (event.key === 'ArrowRight' ? 5 : event.key === 'ArrowLeft' ? -5 : 0)));
    state.position.y = Math.max(43, Math.min(76, state.position.y + (event.key === 'ArrowDown' ? 4 : event.key === 'ArrowUp' ? -4 : 0)));
    persist(); updateActors();
  }
});
app.addEventListener('click', async event => {
  const el = event.target.closest('button, a[data-action]');
  if (!el) {
    const worldEl = event.target.closest('#world');
    if (worldEl && !modal && ['intro', 'explore', 'complete'].includes(state.stage)) {
      const rect = worldEl.querySelector('.world-plane').getBoundingClientRect();
      state.position = { x: Math.max(18, Math.min(82, (event.clientX - rect.left) / rect.width * 100)), y: Math.max(43, Math.min(76, (event.clientY - rect.top) / rect.height * 100)) };
      persist(); updateActors();
    }
    return;
  }
  if (el.disabled) return;
  event.preventDefault();
  if (el.dataset.tab) { tab = el.dataset.tab; render(`#tab-${tab}`); return; }
  if (el.dataset.part) {
    selectedPart = Number(el.dataset.part);
    if (!state.inspected.includes(selectedPart)) state.inspected.push(selectedPart);
    persist(); render(); focusPanel(); return;
  }
  if (el.dataset.token) {
    if (busy) return;
    const field = app.querySelector('#sql');
    const start = field.selectionStart, end = field.selectionEnd;
    // Insert a clause before a trailing semicolon when the cursor is at the end.
    const atEnd = start === state.code.length && /;\s*$/.test(state.code);
    const position = atEnd ? state.code.lastIndexOf(';') : start;
    const prefix = position > 0 && !/\s/.test(state.code[position - 1]) ? ' ' : '';
    const token = prefix + el.dataset.token + ' ';
    setCode(state.code.slice(0, position) + token + state.code.slice(atEnd ? position : end));
    render('#sql'); const next = app.querySelector('#sql'); next.setSelectionRange(position + token.length, position + token.length); return;
  }
  switch (el.dataset.action) {
    case 'bench': case 'open-bench': openBench(); break;
    case 'mechanic': case 'merchant':
      if (state.stage === 'delivery' || busy) break;
      talk = el.dataset.action; selection = talk; selectedPart = null; state.stage = 'explore'; state.position = { x: talk === 'mechanic' ? 36 : 72, y: 49 }; persist(); render(); focusPanel(); break;
    case 'home': case 'back-world':
      if (busy || state.stage === 'delivery') break;
      state.stage = 'explore'; selectedPart = null; modal = null; persist(); render(); break;
    case 'show-code': tab = 'code'; render('#tab-code'); break;
    case 'toggle-scene': showBenchWorld = !showBenchWorld; render('[data-action="toggle-scene"]'); if (showBenchWorld) app.querySelector('#world').scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth' }); break;
    case 'close-part': selectedPart = null; render(); break;
    case 'run': await execute(); break;
    case 'adjust': app.querySelector('#sql')?.focus(); break;
    case 'hint': state.hint = Math.min(3, state.hint + 1); persist(); render('[data-action="hint"]'); break;
    case 'use-solution': if (!busy) { setCode(SOLUTION_SQL); render('#sql'); } break;
    case 'undo': if (!busy) { const old = previousCode; previousCode = state.code; state.code = old; invalidate(); persist(); render('#sql'); } break;
    case 'deliver':
      if (!assessment?.ok || busy) break;
      state.stage = 'delivery'; state.deliveryStep = 0; selectedPart = null; deliveryProgress = 0; lastFrame = 0; persist(); render(); window.scrollTo({ top: 0, behavior: reduced() ? 'instant' : 'smooth' }); break;
    case 'continue': state.stage = 'explore'; talk = 'merchant'; persist(); render(); break;
    case 'view-result': focusPanel(); break;
    case 'pause': openModal('pause'); break;
    case 'manual': openModal('manual'); break;
    case 'journal': openModal('journal'); break;
    case 'close-modal': closeModal(); break;
  }
});

async function execute() {
  if (busy || state.stage !== 'bench') return;
  const queriedCode = state.code;
  busy = true; invalidate(); render();
  try {
    const queryResult = await runSQL(queriedCode);
    if (state.code !== queriedCode) return;
    result = queryResult; assessment = assessResult(result);
  } catch (e) {
    error = e.message;
    if (/no such column:/.test(error)) error = `A coluna ${error.split('no such column:')[1].trim()} não existe. Veja os nomes disponíveis na aba Dados.`;
    else if (/no such table:/.test(error)) error = 'Essa tabela não existe nesta bancada. Use FROM pecas.';
    else if (/syntax error|incomplete input|unrecognized token/.test(error)) error = 'O banco não conseguiu ler a consulta. Confira as palavras, as aspas dos valores e a posição do ponto e vírgula.';
  }
  finally { busy = false; render(); announce(error || assessment?.message || 'Consultado.'); }
}

function updateActors() {
  const player = document.querySelector('#player');
  if (player) { player.style.left = `${state.position.x}%`; player.style.top = `${state.position.y}%`; }
  const drone = document.querySelector('#drone');
  if (drone && state.stage === 'delivery') {
    const from = state.deliveryStep === 0 ? [65, 76] : [50, 58];
    const to = state.deliveryStep === 0 ? [50, 58] : [68, 47];
    const t = reduced() ? (deliveryProgress >= 1 ? 1 : 0) : deliveryProgress;
    drone.style.left = `${from[0] + (to[0] - from[0]) * t}%`;
    drone.style.top = `${from[1] + (to[1] - from[1]) * t}%`;
    drone.querySelector('.cargo').hidden = state.deliveryStep === 0;
  }
}
function tick(now) {
  if (state.stage === 'delivery' && !modal && !pausedByVisibility) {
    if (!lastFrame) lastFrame = now;
    deliveryProgress += Math.min(now - lastFrame, 100) / (reduced() ? 800 : 2400);
    if (deliveryProgress >= 1) {
      deliveryProgress = 0; state.deliveryStep++;
      if (state.deliveryStep >= 2) { state.completed = true; state.stage = 'complete'; }
      persist(); render();
      if (state.completed) { announce('Feira iluminada! Missão concluída.'); }
    }
    updateActors();
  }
  lastFrame = now;
  requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange', () => { pausedByVisibility = document.hidden; lastFrame = 0; persist(); });
window.addEventListener('pagehide', persist);
persist();
render();
requestAnimationFrame(tick);
