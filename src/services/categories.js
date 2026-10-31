const pool = require('../config/db');
const generateId = require('../utils/id');

const createCategory = async ({ name }) => {
  const id = generateId('category');
  await pool.query('INSERT INTO categories (id, name) VALUES ($1, $2)', [id, name]);
  return id;
};

const getAllCategories = async () => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  return rows;
};

const getCategoryById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0];
};

const findByName = async (name) => {
  const { rows } = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
  return rows[0];
};

const updateCategory = async (id, { name }) => {
  const { rowCount } = await pool.query(
    'UPDATE categories SET name = $1, updated_at = current_timestamp WHERE id = $2',
    [name, id],
  );
  return rowCount;
};

const deleteCategory = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  return rowCount;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  findByName,
  updateCategory,
  deleteCategory,
};
