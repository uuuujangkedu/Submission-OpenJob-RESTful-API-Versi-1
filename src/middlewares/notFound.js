module.exports = (req, res) => {
  res.status(404).json({ status: 'failed', message: 'Route tidak ditemukan' });
};
