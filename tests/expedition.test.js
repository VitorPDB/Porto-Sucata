import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, canCollect, isScannerHit, scannerPosition } from '../src/expedition.js';
import { initialState, normalizeSave } from '../src/mission.js';

test('quest requires discovery, scanner, collection and return before installation', () => {
  let s = initialState();
  assert.equal(advance(s, 'bench').stage, 'briefing');
  assert.equal(advance(s, 'travel').stage, 'briefing');
  for (const action of ['accept','travel','discover','bench']) s = advance(s,action);
  assert.equal(s.stage,'bench');
  s = {...s, stage:'findings', scanRound:2, scanResult:{columns:['id'],values:[[3],[1]]}};
  s = advance(s,'collect');
  assert.equal(advance(s,'deliver').stage,'cargo');
  s = advance(s,'return');
  assert.equal(advance(s,'deliver').stage,'delivery');
  assert.equal(advance({...s,inventory:[1,2]},'deliver').stage,'return');
});
test('timing success never changes SQL selection and duplicate results cannot be collected', () => {
  const s = {...initialState(),stage:'findings',scanRound:2,scanResult:{columns:['id'],values:[[1],[2],[3],[4]]}};
  assert.equal(canCollect(s),true);
  assert.deepEqual(advance(s,'collect').inventory,[1,2,3,4]);
  assert.equal(canCollect({...s,scanRound:1}),false);
  assert.equal(canCollect({...s,scanResult:{columns:['id'],values:[[1],[1]]}}),false);
});
test('scanner has distinct windows in both movement directions', () => {
  assert.equal(isScannerHit(0,.4),true);
  assert.equal(isScannerHit(0,1.6),true);
  assert.equal(isScannerHit(0,.7),false);
  assert.equal(isScannerHit(1,.7),true);
  assert.equal(isScannerHit(1,.4),false);
  assert.equal(scannerPosition(1.5),50);
});
test('legacy drafts and achievements migrate; invalid scanner state recovers', () => {
  const s = normalizeSave({version:1,completed:true,code:'SELECT id FROM pecas;'});
  assert.equal(s.stage,'complete'); assert.equal(s.completed,true); assert.equal(s.version,2);
  assert.equal(s.code,'SELECT id FROM pecas;');
  assert.equal(normalizeSave({version:2,stage:'scan',discovered:true}).stage,'bench');
  assert.equal(normalizeSave({...initialState(),stage:'scan',scanRound:2,scanResult:{columns:['id'],values:[[1],[3]]}}).stage,'findings');
});
