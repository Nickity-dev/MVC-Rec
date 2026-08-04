const db = require('../config/database');

async function findUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

async function createUser({ nome, email, senha, tipo = 'participante' }) {
  const [result] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  );
  return result.insertId;
}

module.exports = { findUserByEmail, createUser };
