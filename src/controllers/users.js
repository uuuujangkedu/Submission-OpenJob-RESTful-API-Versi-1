const bcrypt = require('bcryptjs');
const service = require('../services/users');
const { InvariantError, NotFoundError } = require('../exceptions');

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (await service.findByEmail(email)) {
    throw new InvariantError('Email sudah terdaftar');
  }

  const hashed = await bcrypt.hash(password, 10);
  const id = await service.createUser({ name, email, password: hashed, role });

  res.status(201).json({ status: 'success', data: { id } });
};

const getUserById = async (req, res) => {
  const user = await service.findById(req.params.id);
  if (!user) throw new NotFoundError('User tidak ditemukan');

  res.status(200).json({ status: 'success', data: user });
};

module.exports = { createUser, getUserById };
