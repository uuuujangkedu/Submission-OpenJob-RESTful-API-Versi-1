const service = require('../services/jobs');
const companyService = require('../services/companies');
const categoryService = require('../services/categories');
const { InvariantError, NotFoundError } = require('../exceptions');

const assertRelations = async ({ company_id, category_id }) => {
  if (!(await companyService.getCompanyById(company_id))) {
    throw new InvariantError('company_id tidak ditemukan');
  }
  if (!(await categoryService.getCategoryById(category_id))) {
    throw new InvariantError('category_id tidak ditemukan');
  }
};

const createJob = async (req, res) => {
  await assertRelations(req.body);
  const id = await service.createJob(req.body);
  res.status(201).json({ status: 'success', data: { id } });
};

const getJobs = async (req, res) => {
  const jobs = await service.getAllJobs({
    title: req.query.title,
    companyName: req.query['company-name'],
  });
  res.status(200).json({ status: 'success', data: { jobs } });
};

const getJobsByCompany = async (req, res) => {
  const jobs = await service.getJobsByCompany(req.params.companyId);
  res.status(200).json({ status: 'success', data: { jobs } });
};

const getJobsByCategory = async (req, res) => {
  const jobs = await service.getJobsByCategory(req.params.categoryId);
  res.status(200).json({ status: 'success', data: { jobs } });
};

const getJobById = async (req, res) => {
  const job = await service.getJobById(req.params.id);
  if (!job) throw new NotFoundError('Job tidak ditemukan');

  res.status(200).json({ status: 'success', data: job });
};

const updateJob = async (req, res) => {
  await assertRelations(req.body);
  const rowCount = await service.updateJob(req.params.id, req.body);
  if (!rowCount) throw new NotFoundError('Job tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Job berhasil diperbarui' });
};

const deleteJob = async (req, res) => {
  const rowCount = await service.deleteJob(req.params.id);
  if (!rowCount) throw new NotFoundError('Job tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Job berhasil dihapus' });
};

module.exports = {
  createJob,
  getJobs,
  getJobsByCompany,
  getJobsByCategory,
  getJobById,
  updateJob,
  deleteJob,
};
