const bcrypt = require('bcryptjs');
const userService = require('../services/users');
const service = require('../services/authentications');
const tokenManager = require('../utils/tokenManager');
const { InvariantError, AuthenticationError } = require('../exceptions');

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) throw new AuthenticationError('Email atau password salah');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthenticationError('Email atau password salah');

  const accessToken = tokenManager.generateAccessToken(user.id);
  const refreshToken = tokenManager.generateRefreshToken(user.id);
  await service.addToken(refreshToken);

  res.status(200).json({ status: 'success', data: { accessToken, refreshToken } });
};

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;

  const stored = await service.findToken(token);
  if (!stored) throw new InvariantError('Refresh token tidak valid');

  let payload;
  try {
    payload = tokenManager.verifyRefreshToken(token);
  } catch (err) {
    throw new InvariantError('Refresh token tidak valid');
  }

  const accessToken = tokenManager.generateAccessToken(payload.id);
  res.status(200).json({ status: 'success', data: { accessToken } });
};

const logout = async (req, res) => {
  const { refreshToken: token } = req.body;

  const stored = await service.findToken(token);
  if (!stored) throw new InvariantError('Refresh token tidak valid');

  await service.deleteToken(token);
  res.status(200).json({ status: 'success', message: 'Logout berhasil' });
};

module.exports = { login, refreshToken, logout };
