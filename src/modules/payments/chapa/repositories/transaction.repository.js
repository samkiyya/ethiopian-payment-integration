const buildChapaRepository = ({ mysqlModel, mongoModel }) => {
  const persist = async ({ userId, amount, currency, providerReference, status, metadata, rawRequest, rawResponse, checkoutUrl }) => {
    const mysqlRecord = await mysqlModel.create({
      userId,
      amount,
      currency,
      providerReference,
      status,
      metadata,
      checkoutUrl
    });

    await mongoModel.create({
      mysqlId: mysqlRecord.id,
      rawRequest,
      rawResponse,
      providerReference,
      status,
      userId,
      amount,
      currency
    });

    return mysqlRecord.toJSON();
  };

  const updateStatusByReference = async (providerReference, status, metadata = {}) =>
    mysqlModel.update({ status, metadata }, { where: { providerReference } });

  const listByUser = (userId) =>
    mysqlModel.findAll({ where: { userId }, order: [['created_at', 'DESC']], raw: true });

  const findByReference = (providerReference) =>
    mysqlModel.findOne({ where: { providerReference }, raw: true });

  return {
    persist,
    updateStatus,
    listByUser,
    findByReference,
    updateStatusByReference
  };
};

module.exports = buildChapaRepository;
