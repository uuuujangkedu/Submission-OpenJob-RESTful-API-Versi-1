const service = require('../services/applications');
const userService = require('../services/users');
const jobService = require('../services/jobs');
const { InvariantError, NotFoundError } = require('../exceptions');

const createApplication = async (req, res) => {
  const { user_id, job_id, status } = req.body;

  if (!(await userService.findById(user_id))) throw new NotFoundError('User tidak ditemukan');
  if (!(await jobService.getJobById(job_id))) throw new NotFoundError('Job tidak ditemukan');
  if (await service.findByUserAndJob(user_id, job_id)) {
    throw new InvariantError('Application sudah ada untuk user dan job ini');
  }

  const id = await service.createApplication({ user_id, job_id, status });
  res.status(201).json({ status: 'success', data: { id } });
};

const getApplications = async (req, res) => {
  const applications = await service.getAllApplications();
  res.status(200).json({ status: 'success', data: { applications } });
};

const getApplicationById = async (req, res) => {
  const application = await service.getApplicationById(req.params.id);
  if (!application) throw new NotFoundError('Application tidak ditemukan');

  res.status(200).json({ status: 'success', data: application });
};

const getApplicationsByUser = async (req, res) => {
  const applications = await service.getApplicationsByUser(req.params.userId);
  res.status(200).json({ status: 'success', data: { applications } });
};

const getApplicationsByJob = async (req, res) => {
  const applications = await service.getApplicationsByJob(req.params.jobId);
  res.status(200).json({ status: 'success', data: { applications } });
};

const updateApplication = async (req, res) => {
  const rowCount = await service.updateApplication(req.params.id, req.body);
  if (!rowCount) throw new NotFoundError('Application tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Application berhasil diperbarui' });
};

const deleteApplication = async (req, res) => {
  const rowCount = await service.deleteApplication(req.params.id);
  if (!rowCount) throw new NotFoundError('Application tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Application berhasil dihapus' });
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
};
