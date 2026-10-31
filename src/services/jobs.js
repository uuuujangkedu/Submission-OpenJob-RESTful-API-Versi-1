const pool = require('../config/db');
const generateId = require('../utils/id');

const SELECT_JOB = `
  SELECT j.*, c.name AS company_name, cat.name AS category_name
  FROM jobs j
  JOIN companies c ON c.id = j.company_id
  LEFT JOIN categories cat ON cat.id = j.category_id
`;

const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');

const createJob = async (data) => {
  const id = generateId('job');
  const {
    company_id, category_id, title, description, job_type,
    experience_level, location_type, location_city, salary_min,
    salary_max, is_salary_visible, status,
  } = data;

  await pool.query(
    `INSERT INTO jobs
      (id, company_id, category_id, title, description, job_type,
       experience_level, location_type, location_city, salary_min,
       salary_max, is_salary_visible, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      id, company_id, category_id, title, description, job_type,
      experience_level, location_type, location_city ?? null, salary_min ?? null,
      salary_max ?? null, is_salary_visible, status,
    ],
  );
  return id;
};

const getAllJobs = async ({ title, companyName } = {}) => {
  const conditions = [];
  const values = [];

  if (title && title.trim()) {
    values.push(`%${escapeLike(title.trim())}%`);
    conditions.push(`j.title ILIKE $${values.length}`);
  }
  if (companyName && companyName.trim()) {
    values.push(`%${escapeLike(companyName.trim())}%`);
    conditions.push(`c.name ILIKE $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(`${SELECT_JOB} ${where} ORDER BY j.created_at DESC`, values);
  return rows;
};

const getJobById = async (id) => {
  const { rows } = await pool.query(`${SELECT_JOB} WHERE j.id = $1`, [id]);
  return rows[0];
};

const getJobsByCompany = async (companyId) => {
  const { rows } = await pool.query(`${SELECT_JOB} WHERE j.company_id = $1 ORDER BY j.created_at DESC`, [companyId]);
  return rows;
};

const getJobsByCategory = async (categoryId) => {
  const { rows } = await pool.query(`${SELECT_JOB} WHERE j.category_id = $1 ORDER BY j.created_at DESC`, [categoryId]);
  return rows;
};

const updateJob = async (id, data) => {
  const {
    company_id, category_id, title, description, job_type,
    experience_level, location_type, location_city, salary_min,
    salary_max, is_salary_visible, status,
  } = data;

  const { rowCount } = await pool.query(
    `UPDATE jobs SET
      company_id = $1, category_id = $2, title = $3, description = $4,
      job_type = $5, experience_level = $6, location_type = $7,
      location_city = $8, salary_min = $9, salary_max = $10,
      is_salary_visible = $11, status = $12, updated_at = current_timestamp
     WHERE id = $13`,
    [
      company_id, category_id, title, description, job_type,
      experience_level, location_type, location_city ?? null, salary_min ?? null,
      salary_max ?? null, is_salary_visible, status, id,
    ],
  );
  return rowCount;
};

const deleteJob = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
  return rowCount;
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobsByCompany,
  getJobsByCategory,
  updateJob,
  deleteJob,
};
