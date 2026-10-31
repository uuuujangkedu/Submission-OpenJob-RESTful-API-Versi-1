const userService = require('../services/users');
const applicationService = require('../services/applications');
const bookmarkService = require('../services/bookmarks');
const { NotFoundError } = require('../exceptions');

const getProfile = async (req, res) => {
  const user = await userService.findById(req.auth.id);
  if (!user) throw new NotFoundError('User tidak ditemukan');

  res.status(200).json({ status: 'success', data: user });
};

const getProfileApplications = async (req, res) => {
  const applications = await applicationService.getApplicationsByUser(req.auth.id);
  res.status(200).json({ status: 'success', data: { applications } });
};

const getProfileBookmarks = async (req, res) => {
  const bookmarks = await bookmarkService.getBookmarksByUser(req.auth.id);
  res.status(200).json({ status: 'success', data: { bookmarks } });
};

module.exports = { getProfile, getProfileApplications, getProfileBookmarks };
