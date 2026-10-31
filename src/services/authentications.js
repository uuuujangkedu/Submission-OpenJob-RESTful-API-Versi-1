const pool = require('../config/db');

const addToken = (token) => pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);

const deleteToken = (token) => pool.query('DELETE FROM authentications WHERE token = $1', [token]);

const findToken = async (token) => {
  const { rows } = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);
  return rows[0];
};

module.exports = { addToken, deleteToken, findToken };
