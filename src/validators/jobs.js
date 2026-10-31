const Joi = require('joi');

module.exports = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string()
    .valid('full-time', 'part-time', 'contract', 'internship', 'freelance')
    .default('full-time'),
  experience_level: Joi.string()
    .valid('entry', 'junior', 'mid', 'senior', 'lead')
    .default('entry'),
  location_type: Joi.string().valid('remote', 'onsite', 'hybrid').default('onsite'),
  location_city: Joi.string().allow('', null).optional(),
  salary_min: Joi.number().integer().min(0).optional(),
  salary_max: Joi.number().integer().min(Joi.ref('salary_min')).optional(),
  is_salary_visible: Joi.boolean().default(true),
  status: Joi.string().valid('open', 'close').default('open'),
});
