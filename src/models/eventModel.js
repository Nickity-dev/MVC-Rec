const db = require('../config/database');

async function getAllEvents() {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, u.nome AS organizador_nome, COUNT(i.id) AS total_inscricoes
      FROM eventos e
      LEFT JOIN inscricoes i ON e.id = i.evento_id
      JOIN usuarios u ON e.organizador_id = u.id
      GROUP BY e.id
      ORDER BY e.data_inicio ASC
    `);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getEventById(id) {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, u.nome AS organizador_nome
      FROM eventos e
      JOIN usuarios u ON e.organizador_id = u.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createEvent({ titulo, descricao, data_inicio, local, capacidade, organizador_id }) {
  try {
    const [result] = await db.execute(
      'INSERT INTO eventos (titulo, descricao, data_inicio, local, capacidade, organizador_id) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descricao, data_inicio, local, capacidade, organizador_id]
    );
    return result.insertId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateEvent(id, { titulo, descricao, data_inicio, local, capacidade }) {
  try {
    await db.execute(
      'UPDATE eventos SET titulo = ?, descricao = ?, data_inicio = ?, local = ?, capacidade = ? WHERE id = ?',
      [titulo, descricao, data_inicio, local, capacidade, id]
    );
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    await db.execute('DELETE FROM eventos WHERE id = ?', [id]);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
