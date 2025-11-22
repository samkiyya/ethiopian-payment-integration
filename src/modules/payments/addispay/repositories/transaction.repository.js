const buildAddisPayRepository = ({ mysqlModel, mongoModel }) => {
  const persist = async ({ userId, amount, currency, providerReference, status, metadata, rawRequest, rawResponse }) => {
    const mysqlRecord = await mysqlModel.create({
      userId,
      amount,
      currency,
      providerReference,
      status,
      metadata
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

  const updateStatusByReference = (providerReference, status, metadata = {}) =>
    mysqlModel.update({ status, metadata }, { where: { providerReference } });

  const listByUser = (userId) =>
    mysqlModel.findAll({ where: { userId }, order: [['created_at', 'DESC']], raw: true });

  return {
    persist,
    updateStatusByReference,
    listByUser
  };
};

module.exports = buildAddisPayRepository;
