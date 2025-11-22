const { Schema, model, models } = require('mongoose');

const SantiPayTransactionSchema = new Schema(
  {
    mysqlId: { type: String, index: true },
    rawRequest: { type: Schema.Types.Mixed },
    rawResponse: { type: Schema.Types.Mixed },
    providerReference: { type: String },
    status: { type: String },
    userId: { type: String },
    amount: { type: String },
    currency: { type: String }
  },
  { timestamps: true }
);

const getSantiPayTransactionModel = () =>
  models.SantiPayTransaction || model('SantiPayTransaction', SantiPayTransactionSchema);

module.exports = getSantiPayTransactionModel;
