import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { executeQuery } from './sql-engine.js';

const ready = initSqlJs({ locateFile: () => wasmUrl });
self.onmessage = async ({ data }) => {
  try { self.postMessage({ result: executeQuery(await ready, data.code) }); }
  catch (error) { self.postMessage({ error: error.message }); }
};
