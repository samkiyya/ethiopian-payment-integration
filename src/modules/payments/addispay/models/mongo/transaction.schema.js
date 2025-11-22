const { Schema, model, models } = require('mongoose');

const AddisPayTransactionSchema = new Schema(
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

const getAddisPayTransactionModel = (connection) => {
  if (connection) {
    return (
      connection.models.AddisPayTransaction ||
      connection.model('AddisPayTransaction', AddisPayTransactionSchema)
    );
  }
  return models.AddisPayTransaction || model('AddisPayTransaction', AddisPayTransactionSchema);
};

module.exports = getAddisPayTransactionModel;
