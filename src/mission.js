export const STARTER_SQL = 'SELECT id, nome\nFROM pecas;';
export const SOLUTION_SQL = "SELECT id, nome\nFROM pecas\nWHERE tipo = 'lampada'\n  AND estado = 'funcionando';";
export const PARTS = Object.freeze([
  { id: 1, nome: 'Lâmpada A', tipo: 'lampada', estado: 'funcionando' },
  { id: 2, nome: 'Lâmpada B', tipo: 'lampada', estado: 'quebrada' },
  { id: 3, nome: 'Lâmpada C', tipo: 'lampada', estado: 'funcionando' },
  { id: 4, nome: 'Rádio de bolso', tipo: 'radio', estado: 'funcionando' },
]);
export const HINTS = [
  'SELECT escolhe as colunas; FROM indica a tabela. Execute o catálogo primeiro e observe o que o drone seleciona.',
  "WHERE filtra as linhas. A feira precisa do tipo 'lampada' e do estado 'funcionando'. AND exige as duas condições juntas.",
  'Uma solução está abaixo. Leia cada condição e experimente executá-la; pedir ajuda não tira seu progresso.',
];

// IDs are the only controller contract; SQL result order is deliberately irrelevant.
export function assessResult(result) {
  const columns = result?.columns ?? [];
  const rows = result?.values ?? [];
  const idIndex = columns.findIndex(c => c.toLowerCase() === 'id');
  if (idIndex < 0) return { ok: false, ids: [], message: 'Inclua a coluna id no SELECT. O drone usa esse identificador para reconhecer cada peça.' };
  const ids = rows.map(row => row[idIndex]);
  if (ids.some(id => !Number.isInteger(id) || !PARTS.some(p => p.id === id))) {
    return { ok: false, ids: [], message: 'O resultado precisa conter os identificadores das peças do catálogo, sem alterá-los.' };
  }
  if (new Set(ids).size !== ids.length) return { ok: false, ids: [...new Set(ids)], message: 'Há peças repetidas no resultado. Cada lâmpada deve ser enviada uma única vez.' };
  const ok = ids.length === 2 && ids.includes(1) && ids.includes(3);
  let message = 'As duas lâmpadas funcionando estão selecionadas. O drone pode levá-las para a feira.';
  if (!ok) {
    if (!ids.length) message = 'Nenhuma peça passou pelo filtro. Confira os valores lampada e funcionando na aba Dados.';
    else if (ids.includes(2)) message = 'A Lâmpada B está quebrada. Acrescente uma condição para selecionar apenas peças funcionando.';
    else if (ids.includes(4)) message = 'O rádio funciona, mas não ilumina a feira. Filtre também o tipo da peça.';
    else message = 'Falta uma lâmpada: a feira precisa da A e da C, ambas funcionando.';
  }
  return { ok, ids, message };
}

export const SAVE_KEY = 'porto-sucata:save:v1';
export function initialState() {
  return { version: 1, stage: 'intro', code: STARTER_SQL, hint: 0, position: { x: 50, y: 76 }, deliveryStep: 0, completed: false, inspected: [], reducedMotion: false };
}
export function normalizeSave(raw) {
  const base = initialState();
  if (!raw || raw.version !== 1) return base;
  const stages = ['intro', 'explore', 'bench', 'delivery', 'complete'];
  return {
    ...base,
    stage: stages.includes(raw.stage) ? raw.stage : 'intro',
    code: typeof raw.code === 'string' ? raw.code.slice(0, 6000) : base.code,
    hint: Math.min(3, Math.max(0, Number(raw.hint) || 0)),
    position: { x: Math.max(18, Math.min(82, Number(raw.position?.x) || 50)), y: Math.max(43, Math.min(76, Number(raw.position?.y) || 70)) },
    deliveryStep: Math.min(2, Math.max(0, Math.floor(Number(raw.deliveryStep) || 0))),
    completed: raw.completed === true,
    inspected: Array.isArray(raw.inspected) ? raw.inspected.filter(id => PARTS.some(p => p.id === id)) : [],
    reducedMotion: raw.reducedMotion === true,
  };
}
export function loadSave(storage) {
  try { return normalizeSave(JSON.parse(storage.getItem(SAVE_KEY))); } catch { return initialState(); }
}
export function writeSave(storage, state) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}
