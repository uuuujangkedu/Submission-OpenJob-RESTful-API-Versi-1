const pool = require('../config/db');
const generateId = require('../utils/id');

const createUser = async ({ name, email, password, role }) => {
  const id = generateId('user');
  await pool.query(
    'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
    [id, name, email, password, role],
  );
  return id;
};

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, role FROM users WHERE id = $1',
    [id],
  );
  return rows[0];
};

module.exports = { createUser, findByEmail, findById };
