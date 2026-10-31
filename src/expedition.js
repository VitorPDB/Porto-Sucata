import { assessResult, initialState } from './mission.js';

export const SCAN_STEPS = [
  { title: 'Sintonizar o lote', min: 28, max: 58, duration: 2400 },
  { title: 'Estabilizar a leitura', min: 61, max: 83, duration: 1800 },
];
export const scannerPosition = phase => (phase <= 1 ? phase : 2 - phase) * 100;
export function isScannerHit(round, phase) {
  const step = SCAN_STEPS[round];
  return !!step && scannerPosition(phase) >= step.min && scannerPosition(phase) <= step.max;
}
export const cargoAssessment = state => assessResult({ columns: ['id'], values: state.inventory.map(id => [id]) });
export function canCollect(state) {
  if (state.stage !== 'findings' || state.scanRound !== 2 || !state.scanResult) return false;
  const check = assessResult(state.scanResult);
  return check.ids.length > 0 && check.ids.length === state.scanResult.values.length;
}

// State transitions enforce the day loop; clicks cannot skip recovery or the return trip.
export function advance(state, action) {
  const next = structuredClone(state);
  switch (action) {
    case 'accept':
      if (state.stage !== 'briefing') return state;
      next.accepted = true; next.stage = 'map'; break;
    case 'travel':
      if (!state.accepted || state.stage === 'delivery') return state;
      next.stage = 'explore'; next.location = 'deposito'; next.position = { x: 48, y: 76 }; break;
    case 'discover':
      if (state.location !== 'deposito' || !state.accepted) return state;
      next.discovered = true; next.position = { x: 66, y: 60 }; break;
    case 'bench':
      if (!state.discovered || state.location !== 'deposito') return state;
      next.stage = 'bench'; break;
    case 'collect':
      if (!canCollect(state)) return state;
      next.inventory = assessResult(state.scanResult).ids; next.stage = 'cargo'; break;
    case 'return':
      if (state.stage === 'delivery') return state;
      next.stage = 'return'; next.location = 'cais'; next.position = { x: 38, y: 49 }; break;
    case 'deliver':
      if (state.stage !== 'return' || !cargoAssessment(state).ok) return state;
      next.stage = 'delivery'; next.deliveryStep = 0; break;
    case 'replay':
      if (!state.completed) return state;
      return { ...initialState(), completed: true, code: state.code, assisted: state.assisted, reducedMotion: state.reducedMotion };
    default: return state;
  }
  return next;
}
