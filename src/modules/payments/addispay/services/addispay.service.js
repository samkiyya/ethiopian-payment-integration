const AppError = require('../../../../core/errors/appError');
const createAddisPayClient = require('../clients/addispay.client');

const buildAddisPayService = ({ repository }) => {
  const client = createAddisPayClient();

  const initiatePayment = async ({ userId, amount, currency, customerId, description, metadata }) => {
    const payload = {
      amount,
      currency,
      customer_id: customerId,
      description,
      metadata
    };

    try {
      const { data } = await client.post('/payments/initiate', payload);
      const providerReference = data?.data?.reference || data?.reference;

      await repository.persist({
        userId,
        amount,
        currency,
        providerReference,
        status: 'pending',
        metadata,
        rawRequest: payload,
        rawResponse: data
      });

      return {
        providerReference,
        status: data?.data?.status || 'pending'
      };
    } catch (error) {
      throw new AppError(`AddisPay initialization failed: ${error.message}`, error.response?.status || 502);
    }
  };

  const verifyPayment = async ({ reference }) => {
    try {
      const { data } = await client.get(`/payments/${reference}`);
      const status = data?.data?.status;
      await repository.updateStatusByReference(reference, status, { verification: data });
      return data;
    } catch (error) {
      throw new AppError(`AddisPay verification failed: ${error.message}`, error.response?.status || 502);
    }
  };

  const listPayments = (userId) => repository.listByUser(userId);

  return {
    initiatePayment,
    verifyPayment,
    listPayments
  };
};

module.exports = buildAddisPayService;
