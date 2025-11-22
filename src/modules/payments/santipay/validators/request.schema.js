const Joi = require('joi');

const initiateSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().default('ETB'),
  description: Joi.string().required(),
  customerPhone: Joi.string().required(),
  metadata: Joi.object().default({})
});

module.exports = {
  initiateSchema
};
