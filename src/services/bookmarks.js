const pool = require('../config/db');
const generateId = require('../utils/id');

const createBookmark = async (userId, jobId) => {
  const id = generateId('bookmark');
  await pool.query(
    'INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3)',
    [id, userId, jobId],
  );
  return id;
};

const getBookmarkById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM bookmarks WHERE id = $1', [id]);
  return rows[0];
};

const findByUserAndJob = async (userId, jobId) => {
  const { rows } = await pool.query(
    'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
    [userId, jobId],
  );
  return rows[0];
};

const deleteBookmark = async (userId, jobId) => {
  const { rowCount } = await pool.query(
    'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2',
    [userId, jobId],
  );
  return rowCount;
};

const getBookmarksByUser = async (userId) => {
  const { rows } = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return rows;
};

module.exports = {
  createBookmark,
  getBookmarkById,
  findByUserAndJob,
  deleteBookmark,
  getBookmarksByUser,
};
