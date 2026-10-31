const service = require('../services/categories');
const { InvariantError, NotFoundError } = require('../exceptions');

const createCategory = async (req, res) => {
  const { name } = req.body;

  if (await service.findByName(name)) {
    throw new InvariantError('Category sudah terdaftar');
  }

  const id = await service.createCategory({ name });
  res.status(201).json({ status: 'success', data: { id } });
};

const getCategories = async (req, res) => {
  const categories = await service.getAllCategories();
  res.status(200).json({ status: 'success', data: { categories } });
};

const getCategoryById = async (req, res) => {
  const category = await service.getCategoryById(req.params.id);
  if (!category) throw new NotFoundError('Category tidak ditemukan');

  res.status(200).json({ status: 'success', data: category });
};

const updateCategory = async (req, res) => {
  const existing = await service.getCategoryById(req.params.id);
  if (!existing) throw new NotFoundError('Category tidak ditemukan');

  const duplicate = await service.findByName(req.body.name);
  if (duplicate && duplicate.id !== existing.id) {
    throw new InvariantError('Category sudah terdaftar');
  }

  await service.updateCategory(req.params.id, req.body);
  res.status(200).json({ status: 'success', message: 'Category berhasil diperbarui' });
};

const deleteCategory = async (req, res) => {
  const rowCount = await service.deleteCategory(req.params.id);
  if (!rowCount) throw new NotFoundError('Category tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Category berhasil dihapus' });
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
