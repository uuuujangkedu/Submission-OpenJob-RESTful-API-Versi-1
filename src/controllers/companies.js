const service = require('../services/companies');
const { NotFoundError } = require('../exceptions');

const createCompany = async (req, res) => {
  const id = await service.createCompany(req.body);
  res.status(201).json({ status: 'success', data: { id } });
};

const getCompanies = async (req, res) => {
  const companies = await service.getAllCompanies();
  res.status(200).json({ status: 'success', data: { companies } });
};

const getCompanyById = async (req, res) => {
  const company = await service.getCompanyById(req.params.id);
  if (!company) throw new NotFoundError('Company tidak ditemukan');

  res.status(200).json({ status: 'success', data: company });
};

const updateCompany = async (req, res) => {
  const rowCount = await service.updateCompany(req.params.id, req.body);
  if (!rowCount) throw new NotFoundError('Company tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Company berhasil diperbarui' });
};

const deleteCompany = async (req, res) => {
  const rowCount = await service.deleteCompany(req.params.id);
  if (!rowCount) throw new NotFoundError('Company tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Company berhasil dihapus' });
};

module.exports = { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };
