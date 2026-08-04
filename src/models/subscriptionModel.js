const db = require('../config/database');

async function createSubscription(eventoId, usuarioId) {
  const [result] = await db.execute(
    'INSERT INTO inscricoes (evento_id, usuario_id) VALUES (?, ?)',
    [eventoId, usuarioId]
  );
  return result.insertId;
}

async function findSubscription(eventoId, usuarioId) {
  const [rows] = await db.execute('SELECT * FROM inscricoes WHERE evento_id = ? AND usuario_id = ?', [eventoId, usuarioId]);
  return rows[0];
}

async function getSubscriptionsByEvent(eventoId) {
  const [rows] = await db.execute(`
    SELECT i.*, u.nome, u.email
    FROM inscricoes i
    JOIN usuarios u ON i.usuario_id = u.id
    WHERE i.evento_id = ?
    ORDER BY i.id DESC
  `, [eventoId]);
  return rows;
}

module.exports = { createSubscription, findSubscription, getSubscriptionsByEvent };
