export function runSQL(code) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./sql.worker.js', import.meta.url), { type: 'module' });
    const finish = () => { clearTimeout(timer); worker.terminate(); };
    // Fresh isolated worker per run: runaway queries cannot freeze the game or corrupt its data.
    const timer = setTimeout(() => { finish(); reject(new Error('A consulta levou tempo demais. Simplifique-a e tente novamente; seu código continua aqui.')); }, 6000);
    worker.onmessage = ({ data }) => { finish(); data.error ? reject(new Error(data.error)) : resolve(data.result); };
    worker.onerror = () => { finish(); reject(new Error('Não foi possível abrir a bancada SQL. Confira sua conexão e tente de novo.')); };
    worker.postMessage({ code });
  });
}
