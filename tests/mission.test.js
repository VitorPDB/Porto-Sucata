import test from 'node:test';
import assert from 'node:assert/strict';
import initSqlJs from 'sql.js';
import { executeQuery } from '../src/sql-engine.js';
import { assessResult, SOLUTION_SQL, initialState, loadSave, writeSave, SAVE_KEY } from '../src/mission.js';

const SQL = await initSqlJs();
const assess = code => assessResult(executeQuery(SQL, code));
test('real SQLite executes correct and equivalent predicates, independent of ordering', () => {
  assert.equal(assess(SOLUTION_SQL).ok, true);
  assert.equal(assess("select * from pecas where estado='funcionando' and tipo='lampada' order by id desc").ok, true);
  assert.equal(assess("WITH boas AS (SELECT * FROM pecas WHERE tipo='lampada') SELECT id FROM boas WHERE estado <> 'quebrada';").ok, true);
});
test('wrong filter, empty results, missing IDs and duplicates cannot pass', () => {
  assert.equal(assess('SELECT id FROM pecas;').ok, false);
  assert.deepEqual(assess("SELECT id FROM pecas WHERE estado='funcionando'").ids, [1, 3, 4]);
  assert.equal(assess('SELECT id FROM pecas WHERE id IN (1, 2)').ok, false);
  assert.equal(assess('SELECT id FROM pecas WHERE id=99').ok, false);
  assert.equal(assess('SELECT nome FROM pecas').ok, false);
  assert.equal(assess('SELECT id FROM pecas WHERE id IN (1,3) UNION ALL SELECT id FROM pecas WHERE id=1').ok, false);
});
test('statement boundaries, errors and read-only behavior preserve catalog', () => {
  assert.throws(() => executeQuery(SQL, 'DELETE FROM pecas;'), /SELECT/);
  assert.throws(() => executeQuery(SQL, 'SELECT id FROM pecas; DELETE FROM pecas;'), /uma consulta/);
  assert.throws(() => executeQuery(SQL, 'SELECT inexistente FROM pecas'), /no such column/);
  assert.throws(() => executeQuery(SQL, '-- só um comentário'), /SELECT/);
  assert.equal(executeQuery(SQL, "SELECT ';' AS separador, id FROM pecas WHERE id=1;").values.length, 1);
  assert.equal(executeQuery(SQL, 'SELECT * FROM pecas').values.length, 4);
});
test('saves preserve draft and delivery progress, corrupt or future saves are safe', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const state = { ...initialState(), stage: 'delivery', deliveryStep: 1, code: SOLUTION_SQL, inspected: [1, 3] };
  assert.equal(writeSave(storage, state), true);
  assert.deepEqual(loadSave(storage), state);
  values.set(SAVE_KEY, '{invalid');
  assert.deepEqual(loadSave(storage), initialState());
  values.set(SAVE_KEY, '{"version":99}');
  assert.deepEqual(loadSave(storage), initialState());
  assert.equal(writeSave({ setItem() { throw Error('blocked'); } }, state), false);
});
