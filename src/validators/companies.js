const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
});
