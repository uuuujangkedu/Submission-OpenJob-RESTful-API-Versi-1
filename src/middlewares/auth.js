const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../exceptions');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthenticationError('Access token tidak ditemukan'));
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return next(new AuthenticationError('Access token tidak ditemukan'));
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.auth = { id: payload.id };
    return next();
  } catch (err) {
    return next(new AuthenticationError('Access token tidak valid'));
  }
};
