const Joi = require('joi');

module.exports = {
  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
