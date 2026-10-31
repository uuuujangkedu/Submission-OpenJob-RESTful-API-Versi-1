const { ClientError } = require('../exceptions');

module.exports = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({ status: 'failed', message: err.message });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ status: 'failed', message: 'Body JSON tidak valid' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'failed', message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 'failed', message: 'Terjadi kegagalan pada server' });
};
