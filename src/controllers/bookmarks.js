const service = require('../services/bookmarks');
const jobService = require('../services/jobs');
const { InvariantError, NotFoundError } = require('../exceptions');

const createBookmark = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.auth.id;

  if (!(await jobService.getJobById(jobId))) throw new NotFoundError('Job tidak ditemukan');
  if (await service.findByUserAndJob(userId, jobId)) {
    throw new InvariantError('Job sudah di-bookmark');
  }

  const id = await service.createBookmark(userId, jobId);
  res.status(201).json({ status: 'success', data: { id } });
};

const getBookmarkById = async (req, res) => {
  const bookmark = await service.getBookmarkById(req.params.id);
  if (!bookmark) throw new NotFoundError('Bookmark tidak ditemukan');

  res.status(200).json({ status: 'success', data: bookmark });
};

const deleteBookmark = async (req, res) => {
  const rowCount = await service.deleteBookmark(req.auth.id, req.params.jobId);
  if (!rowCount) throw new NotFoundError('Bookmark tidak ditemukan');

  res.status(200).json({ status: 'success', message: 'Bookmark berhasil dihapus' });
};

const getMyBookmarks = async (req, res) => {
  const bookmarks = await service.getBookmarksByUser(req.auth.id);
  res.status(200).json({ status: 'success', data: { bookmarks } });
};

module.exports = { createBookmark, getBookmarkById, deleteBookmark, getMyBookmarks };
