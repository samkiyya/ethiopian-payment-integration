const Joi = require('joi');

const initiateSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().default('ETB'),
  callbackUrl: Joi.string().uri().required(),
  reference: Joi.string().optional(),
  metadata: Joi.object().default({})
});

const verifySchema = Joi.object({
  reference: Joi.string().required()
});

module.exports = {
  initiateSchema,
  verifySchema
};
