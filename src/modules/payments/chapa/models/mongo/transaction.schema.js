const { Schema, model, models } = require('mongoose');

const ChapaTransactionSchema = new Schema(
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

const getChapaTransactionModel = (connection) => {
  if (connection) {
    return connection.models.ChapaTransaction || connection.model('ChapaTransaction', ChapaTransactionSchema);
  }
  return models.ChapaTransaction || model('ChapaTransaction', ChapaTransactionSchema);
};

module.exports = getChapaTransactionModel;
