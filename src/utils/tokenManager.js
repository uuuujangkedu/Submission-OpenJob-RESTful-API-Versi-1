const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const accessKey = () => process.env.ACCESS_TOKEN_KEY;
const refreshKey = () => process.env.REFRESH_TOKEN_KEY;
const accessAge = () => Number(process.env.ACCESS_TOKEN_AGE) || 10800;

module.exports = {
  generateAccessToken: (id) => jwt.sign({ id }, accessKey(), { expiresIn: accessAge() }),
  generateRefreshToken: (id) => jwt.sign({ id, jti: randomUUID() }, refreshKey()),
  verifyRefreshToken: (token) => jwt.verify(token, refreshKey()),
};
