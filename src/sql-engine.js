import { PARTS } from './mission.js';

export function executeQuery(SQL, code) {
  if (typeof code !== 'string' || !code.trim()) throw new Error('Escreva uma consulta antes de executar. Comece com SELECT id, nome FROM pecas;');
  if (code.length > 6000) throw new Error('A consulta está muito longa para esta bancada. Use até 6.000 caracteres.');
  const db = new SQL.Database();
  try {
    db.run('CREATE TABLE pecas (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, tipo TEXT NOT NULL, estado TEXT NOT NULL);');
    const insert = db.prepare('INSERT INTO pecas VALUES (?, ?, ?, ?)');
    try { for (const p of PARTS) insert.run([p.id, p.nome, p.tipo, p.estado]); } finally { insert.free(); }
    db.run('PRAGMA query_only = ON;');
    let count = 0;
    let result;
    // SQLite parses the statements: semicolons inside strings/comments are not split by regex.
    for (const statement of db.iterateStatements(code)) {
      count++;
      if (count > 1) throw new Error('Execute uma consulta por vez. Seu código foi preservado.');
      const sql = statement.getSQL().replace(/\/\*[\s\S]*?\*\/|--[^\n]*/g, '').trim();
      if (!/^(SELECT|WITH)\b/i.test(sql)) throw new Error('Esta bancada aceita consultas SELECT (incluindo WITH). O catálogo não pode ser alterado.');
      const columns = statement.getColumnNames();
      const values = [];
      while (statement.step()) {
        if (values.length >= 100) throw new Error('O resultado passou de 100 linhas. Reduza a consulta para as peças do pedido.');
        values.push(statement.get());
      }
      result = { columns, values };
    }
    if (!count) throw new Error('Escreva uma consulta SELECT, não apenas comentários.');
    return result;
  } finally { db.close(); }
}
