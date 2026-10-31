const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().min(1).required(),
});
