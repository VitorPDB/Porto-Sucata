import '@fontsource/fraunces/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './style.css';
import './expedition.css';
import { PARTS, HINTS, SOLUTION_SQL, assessResult, loadSave, writeSave } from './mission.js';
import { advance, SCAN_STEPS, scannerPosition, isScannerHit, cargoAssessment, canCollect } from './expedition.js';
import { runSQL } from './sql-client.js';
import { icon } from './icons.js';

const app = document.querySelector('#app');
let storage; try { storage = localStorage; } catch { storage = null; }
let state = loadSave(storage), modal = null, tab = 'code', busy = false, error = '', running = false, message = '', last = 0, delivery = 0, saveOK = true;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced = () => state.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
const assist = () => state.assisted || reduced();
const save = () => { saveOK = writeSave(storage, state); };
const button = (action, label, primary = false) => `<button class="button ${primary ? 'primary' : 'secondary'}" data-action="${action}" ${busy ? 'disabled' : ''}>${label}</button>`;
const heading = (title, sub = '') => `<div class="panel-heading"><h2 tabindex="-1">${title}</h2><p>${sub}</p></div>`;
const sprite = kind => `<span class="sprite sprite-${kind}" aria-hidden="true"></span>`;
function table(data = { columns: ['id','nome','tipo','estado'], values: PARTS.map(p => Object.values(p)) }) {
  return `<div class="table-scroll"><table><thead><tr>${data.columns.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${data.values.map(row => `<tr>${row.map(v => `<td>${esc(v === null ? 'NULL' : v)}</td>`).join('')}</tr>`).join('') || '<tr><td>Nenhuma peça encontrada.</td></tr>'}</tbody></table></div>`;
}
function world() {
  const depot = state.location === 'deposito';
  return `<section class="world-wrap" aria-label="Região atual"><div class="world-caption"><span>${icon('anchor')}${depot ? 'Depósito de luminárias' : 'Cais da oficina'}</span><span>Dia 1</span></div><div class="world ${state.completed && !depot ? 'lit' : ''}" id="world"><div class="world-plane"><img class="scene" src="/art/${depot ? 'deposito-luminarias' : 'cais-oficina'}.png" alt="${depot ? 'Depósito de madeira com caixas e luminárias antigas.' : 'Oficina e barraca à beira do cais.'}">
  ${depot ? `<button class="hotspot records ${state.clue ? 'selected' : ''}" data-action="records" ${state.stage !== 'explore' ? 'disabled' : ''}><span>${icon('book')}Registros ${state.clue ? '✓' : ''}</span></button><button class="hotspot salvage ${state.discovered ? 'selected' : ''}" data-action="discover" ${state.stage !== 'explore' ? 'disabled' : ''}><span>${icon('wrench')}${state.discovered ? 'Lote encontrado ✓' : 'Investigar lote'}</span></button>` : `<div class="lamp lamp-left"></div><div class="lamp lamp-right"></div><div class="actor mechanic">${sprite('mechanic')}<span class="actor-name">Mecânica</span></div><div class="actor merchant">${sprite('merchant')}<span class="actor-name">Feirante</span></div>`}
  <div class="actor player" style="left:${state.position.x}%;top:${state.position.y}%">${sprite('player')}</div><div class="actor drone" style="left:68%;top:${state.stage === 'complete' ? 47 : 76}%">${sprite('drone')}${state.inventory.length ? `<span class="cargo">${icon('bulb')} ×${state.inventory.length}</span>` : ''}</div></div><span class="world-tip">${state.stage === 'complete' ? 'A feira voltou a brilhar' : depot ? (state.stage === 'explore' ? 'Escolha um ponto de interesse' : 'Siga a leitura no painel') : state.stage === 'briefing' ? 'Receba o pedido da mecânica' : state.stage === 'delivery' ? 'Preparando a iluminação da feira' : 'Confira seu próximo passo no painel'}</span></div></section>`;
}
function terminal() {
  return `${heading('Configurar scanner', 'Escolha as peças antes de fixar o sinal.')}<div class="tabs" role="tablist" aria-label="Scanner">${[['request','Pedido'],['code','Código'],['data','Dados']].map(([id,label]) => `<button role="tab" id="tab-${id}" aria-selected="${tab === id}" tabindex="${tab === id ? 0 : -1}" aria-controls="terminal-panel" data-tab="${id}">${label}</button>`).join('')}</div><section id="terminal-panel" role="tabpanel" aria-labelledby="tab-${tab}">
  ${tab === 'request' ? '<h3>Duas lâmpadas para a feira</h3><p>Selecione apenas as lâmpadas funcionando. Inclua <code>id</code> para identificar as peças. O timing opera o scanner; sua consulta determina a carga.</p>' : tab === 'data' ? `<h3>Catálogo · tabela pecas</h3>${table()}<p class="quiet">Dados autorais deste exercício.</p>` : `<label class="editor-label" for="sql">Sua consulta <span>SQLite local · somente leitura</span></label><textarea id="sql" spellcheck="false" autocapitalize="off" maxlength="6000" ${busy ? 'readonly' : ''}>${esc(state.code)}</textarea><p class="quiet">SELECT escolhe colunas. WHERE filtra peças.</p>${button('run',busy ? 'Consultando…' : 'Preparar varredura',true)}${error ? `<div class="feedback error" role="alert">${esc(error)}</div>` : ''}<div class="hint-area">${button('hint',state.hint ? 'Outra pista' : 'Pedir uma pista')}${state.hint ? `<p>${HINTS[state.hint - 1]}</p>` : ''}${state.hint === 3 ? `<pre><code>${esc(SOLUTION_SQL)}</code></pre>${button('solution','Experimentar esta solução')}` : ''}</div>`}</section>${button('explore','Voltar ao depósito')}`;
}
function panel() {
  switch (state.stage) {
    case 'briefing': return `${heading('Um pedido antes de sair','Dia 1 · Uma luz para a feira')}<p>A mecânica precisa de duas lâmpadas funcionando. Há um lote esquecido no depósito do cais. Investigue, recupere as peças e traga a carga de volta.</p>${button('accept','Aceitar pedido e sair',true)}<p class="quiet">O dia avança com suas ações. Sem contagem regressiva.</p>`;
    case 'map': return `${heading('Sua expedição','Destino · Depósito de luminárias')}<img class="destination-art" src="/art/deposito-luminarias.png" alt="Interior do depósito"><p>Procure os registros do lote e investigue as caixas.</p>${button('travel','Explorar depósito',true)}`;
    case 'explore': return `${heading(state.discovered ? 'Um lote para investigar' : 'Entre caixas e ferrugem','Depósito de luminárias')}<p>${state.discovered ? 'Quatro peças encontradas. Configure o scanner para escolher quais recuperar.' : 'Escolha um ponto do cenário. Os registros podem revelar uma pista sobre as peças.'}</p>${state.clue ? '<div class="feedback"><strong>Anotação encontrada</strong><p>“A e C testadas. B com filamento partido. Rádio ainda recebe sinal.” O estado da peça é tão importante quanto o tipo.</p></div>' : ''}${state.discovered ? button('bench','Configurar scanner',true) : button('discover','Investigar lote',true)}${button('return','Voltar à oficina')}`;
    case 'bench': return terminal();
    case 'scan': {
      const step = SCAN_STEPS[state.scanRound];
      return `${heading('Scanner de sucata',`Etapa ${state.scanRound + 1} de 2 · ${step.title}`)}<p>A consulta já definiu as peças. Fixe o sinal para revelar o resultado.</p><div class="scan-console"><span>ÁREA DE SINAL · faixa marcada</span><div id="scan-meter" data-position="${scannerPosition(state.scanPhase)}"><span class="scan-target" style="left:${step.min}%;width:${step.max-step.min}%"></span><span class="scan-cursor" style="left:${scannerPosition(state.scanPhase)}%"></span></div><p>${assist() ? 'Sem tempo: confirme quando estiver pronto.' : 'Toque em Fixar sinal quando o cursor estiver dentro da faixa.'}</p></div>${assist() ? button('scan-assist','Confirmar sinal',true) : running ? button('scan-hit','Fixar sinal',true) : button('scan-start','Iniciar leitura',true)}<p role="status">${message || 'Cada etapa concluída fica salva. Errar não tira peças.'}</p><details><summary>Consulta enviada</summary><pre><code>${esc(state.code)}</code></pre></details>${button('pause','Opções · jogar sem tempo')}`;
    }
    case 'findings': return `${heading('Leitura concluída','Resultado real da sua consulta')}<div class="feedback"><p>${esc(assessResult(state.scanResult).message)}</p></div>${table(state.scanResult)}${canCollect(state) ? button('collect','Recolher peças selecionadas',true) : ''}${button('adjust','Ajustar consulta')}`;
    case 'cargo': return `${heading('Carga recuperada','Agora é hora de voltar')}<p>${state.inventory.map(id => PARTS.find(p => p.id === id).nome).join(', ')}</p><p>A missão termina quando você entrega as peças certas na oficina.</p>${button('return','Voltar com a carga',true)}${button('adjust','Rever seleção')}`;
    case 'return': return `${heading('De volta à oficina','A mecânica confere sua carga')}<p>${state.inventory.map(id => PARTS.find(p => p.id === id).nome).join(', ') || 'Você voltou sem peças.'}</p><div class="feedback"><p>${esc(cargoAssessment(state).message)}</p></div>${cargoAssessment(state).ok ? button('deliver','Instalar lâmpadas e encerrar o dia',true) : button('travel','Voltar ao depósito',true)}`;
    case 'delivery': return `${heading('Uma última ajuda do drone','Instalando as lâmpadas recuperadas')}<ol class="delivery-steps"><li class="done">Carga conferida</li><li class="${state.deliveryStep ? 'done' : 'active'}">Preparar luminárias</li><li class="${state.deliveryStep ? 'active' : ''}">Iluminar a barraca</li></ol><p>Suas escolhas mudam um pedacinho do porto.</p>${button('pause','Pausar instalação')}`;
    case 'complete': return `${heading('Feira iluminada!','Um pedacinho do porto de volta à vida.')}<p>Você investigou o depósito, filtrou as peças e trouxe duas lâmpadas funcionando.</p><div class="reward">${icon('book')}<div><strong>Ferramenta descoberta: ORDER BY</strong><span>Aprenda a ordenar resultados no Manual.</span></div></div>${button('manual','Conhecer ORDER BY',true)}${button('replay','Repetir expedição')}<p class="quiet">Primeira missão concluída. Novas histórias ainda estão em construção.</p>`;
  }
}
function overlay() {
  const content = modal === 'pause' ? `${heading('Um descanso no cais','Continue quando quiser.')}<p>${saveOK ? 'Seu progresso está salvo neste navegador.' : 'Não foi possível salvar. Mantenha esta página aberta.'}</p><label class="check-field"><input id="assisted" type="checkbox" ${state.assisted ? 'checked' : ''}> Scanner sem tempo · mesma recompensa</label><label class="check-field"><input id="motion" type="checkbox" ${state.reducedMotion ? 'checked' : ''}> Reduzir movimentos</label><p class="quiet">Sem conta ou sincronização. Limpar os dados do navegador apaga o progresso.</p>` : modal === 'journal' ? `${heading('Diário do cais')}<h3>Uma luz para a feira</h3><p>${state.completed ? 'Concluída. A feira voltou a brilhar.' : 'Em andamento. Recupere duas lâmpadas funcionando.'}</p><ul><li>Pedido: ${state.accepted ? 'aceito' : 'aguardando'}</li><li>Lote: ${state.discovered ? 'encontrado' : 'não investigado'}</li><li>Carga: ${state.inventory.length} peças</li></ul>` : `${heading('Caderno de ferramentas')}<p><code>SELECT id, nome</code> escolhe colunas; <code>FROM pecas</code> indica a tabela.</p><p><code>WHERE</code> filtra as linhas. <code>AND</code> exige que as duas condições sejam verdadeiras.</p><h3>Ordenar com ORDER BY</h3><pre><code>ORDER BY nome ASC;</code></pre><p>Acrescente ao final da consulta, antes do ponto e vírgula. ASC ordena de forma crescente; DESC, decrescente. A ordenação não muda quais peças passam pelo filtro.</p><p class="technical-note">Exercício autoral. SQLite real no navegador, não suporte completo a MySQL ou Oracle. O controlador usa os IDs para recolher peças; SQL não movimenta o drone.</p>`;
  return `<dialog id="overlay" aria-label="${modal === 'pause' ? 'Pausa' : modal === 'manual' ? 'Manual' : 'Diário'}"><div class="overlay-content">${content}${button('close','Continuar jogando',true)}</div></dialog>`;
}
function render(focus = false) {
  app.innerHTML = `<div class="game-shell ${['bench','scan'].includes(state.stage) ? 'bench-mode' : ''}"><header class="game-header"><span class="brand">${icon('anchor')}Porto Sucata</span><div class="header-tools"><span class="save-state">${saveOK ? 'Progresso local' : 'Não foi possível salvar'}</span><button class="icon-button" data-action="pause" aria-label="Pausar jogo">${icon('pause')}</button></div></header><div class="objective"><div>${icon(state.completed ? 'check' : 'bulb')}<div><h1>Uma luz para a feira</h1><p>Investigue · recupere · volte à oficina</p></div></div><span class="chapter-label">Primeira missão</span></div><main class="game-layout">${world()}<section class="interaction-panel" id="interaction" aria-label="Interação atual">${panel()}</section></main><nav class="bottom-nav" aria-label="Navegação"><button data-action="game" ${!modal ? 'aria-current="page"' : ''}>${icon('anchor')}Expedição</button><button data-action="journal" ${modal === 'journal' ? 'aria-current="page"' : ''}>${icon('notebook')}Diário</button><button data-action="manual" ${modal === 'manual' ? 'aria-current="page"' : ''}>${icon('book')}Manual</button></nav>${modal ? overlay() : ''}</div>`;
  if (modal) { const dialog = app.querySelector('dialog'); dialog.showModal(); dialog.addEventListener('cancel', e => { e.preventDefault(); modal = null; render(); }); }
  else if (focus) { app.querySelector('h2')?.focus({preventScroll:true}); if (innerWidth < 900) app.querySelector('#interaction').scrollIntoView({block:'start'}); }
}
async function execute() {
  if (busy || state.stage !== 'bench') return;
  busy = true; error = ''; render();
  try { state.scanResult = await runSQL(state.code); state.scanRound = 0; state.scanPhase = 0; state.stage = 'scan'; running = false; message = ''; save(); }
  catch (e) { error = `Confira a consulta e os nomes na aba Dados. ${e.message}`; }
  finally { busy = false; render(true); }
}
app.addEventListener('input', e => { if (e.target.id === 'sql') { state.code = e.target.value; state.scanResult = null; save(); } });
app.addEventListener('change', e => { if (e.target.id === 'assisted') state.assisted = e.target.checked; if (e.target.id === 'motion') state.reducedMotion = e.target.checked; running = false; save(); });
app.addEventListener('keydown', e => {
  if (e.target.id === 'sql' && (e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); execute(); }
  if (e.target.matches('[role="tab"]') && ['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) { e.preventDefault(); const tabs = ['request','code','data']; tab = e.key === 'Home' ? 'request' : e.key === 'End' ? 'data' : tabs[(tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; render(); app.querySelector(`#tab-${tab}`).focus(); }
});
app.addEventListener('click', async e => {
  const el = e.target.closest('button'); if (!el || el.disabled || busy) return;
  if (el.dataset.tab) { tab = el.dataset.tab; render(); app.querySelector(`#tab-${tab}`).focus(); return; }
  const action = el.dataset.action;
  if (['pause','manual','journal'].includes(action)) { running = false; modal = action; save(); render(); return; }
  if (action === 'close') { modal = null; render(); app.querySelector('[data-action="pause"]')?.focus(); return; }
  if (action === 'game') return;
  if (action === 'run') { await execute(); return; }
  if (['scan-start','scan-hit','scan-assist'].includes(action)) {
    if (state.stage !== 'scan') return;
    if (action === 'scan-start') { running = true; message = ''; last = 0; }
    else {
      if (action === 'scan-assist' ? !assist() : !running) return;
      running = false;
      if (action === 'scan-assist' || isScannerHit(state.scanRound,state.scanPhase)) { state.scanRound++; state.scanPhase = 0; message = 'Sinal fixado. Próxima etapa pronta.'; if (state.scanRound === 2) state.stage = 'findings'; }
      else message = 'Quase! Tente novamente. A etapa anterior continua salva.';
    }
    save(); render(state.stage === 'findings');
    if (state.stage === 'scan') app.querySelector(`[data-action="${assist() ? 'scan-assist' : running ? 'scan-hit' : 'scan-start'}"]`)?.focus({preventScroll:true});
    return;
  }
  if (['records','discover'].includes(action) && state.stage !== 'explore') return;
  if (action === 'records') { state.clue = true; state.position = {x:32,y:60}; }
  else if (action === 'adjust') { state.stage = 'bench'; tab = 'code'; }
  else if (action === 'explore') state.stage = 'explore';
  else if (action === 'hint') state.hint = Math.min(3,state.hint + 1);
  else if (action === 'solution') state.code = SOLUTION_SQL;
  else { state = advance(state,action); if (action === 'deliver') delivery = 0; }
  save(); render(!['travel','deliver','hint','solution'].includes(action));
  if (['travel','deliver'].includes(action)) window.scrollTo({top:0});
});
function tick(now) {
  const delta = last ? Math.min(now-last,100) : 0; last = now;
  if (!modal && !document.hidden) {
    if (state.stage === 'scan' && running) { state.scanPhase = (state.scanPhase + delta / SCAN_STEPS[state.scanRound].duration) % 2; const meter = app.querySelector('#scan-meter'); if (meter) { meter.dataset.position = scannerPosition(state.scanPhase); meter.querySelector('.scan-cursor').style.left = scannerPosition(state.scanPhase) + '%'; } }
    if (state.stage === 'delivery') { delivery += delta / (reduced() ? 700 : 1800); if (delivery >= 1) { delivery = 0; state.deliveryStep++; if (state.deliveryStep >= 2) { state.stage = 'complete'; state.completed = true; } save(); render(); } }
  }
  requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange', () => { running = false; last = 0; save(); if (!document.hidden) render(); });
window.addEventListener('pagehide',save);
save(); render(); requestAnimationFrame(tick);
