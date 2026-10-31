const pool = require('../config/db');
const generateId = require('../utils/id');

const createApplication = async ({ user_id, job_id, status }) => {
  const id = generateId('application');
  await pool.query(
    'INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4)',
    [id, user_id, job_id, status],
  );
  return id;
};

const getAllApplications = async () => {
  const { rows } = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
  return rows;
};

const getApplicationById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
  return rows[0];
};

const getApplicationsByUser = async (userId) => {
  const { rows } = await pool.query('SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return rows;
};

const getApplicationsByJob = async (jobId) => {
  const { rows } = await pool.query('SELECT * FROM applications WHERE job_id = $1 ORDER BY created_at DESC', [jobId]);
  return rows;
};

const findByUserAndJob = async (userId, jobId) => {
  const { rows } = await pool.query(
    'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
    [userId, jobId],
  );
  return rows[0];
};

const updateApplication = async (id, { status }) => {
  const { rowCount } = await pool.query(
    'UPDATE applications SET status = $1, updated_at = current_timestamp WHERE id = $2',
    [status, id],
  );
  return rowCount;
};

const deleteApplication = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM applications WHERE id = $1', [id]);
  return rowCount;
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  findByUserAndJob,
  updateApplication,
  deleteApplication,
};
