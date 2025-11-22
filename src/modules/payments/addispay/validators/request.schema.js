const Joi = require('joi');

const initiateSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().default('ETB'),
  customerId: Joi.string().required(),
  description: Joi.string().required(),
  metadata: Joi.object().default({})
});

module.exports = {
  initiateSchema
};
