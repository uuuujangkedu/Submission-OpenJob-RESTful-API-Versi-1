const Joi = require('joi');

const status = Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected');

module.exports = {
  create: Joi.object({
    user_id: Joi.string().required(),
    job_id: Joi.string().required(),
    status: status.default('pending'),
  }),
  update: Joi.object({
    status: status.required(),
  }),
};
