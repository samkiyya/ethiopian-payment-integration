const AppError = require('../../../../core/errors/appError');
const createSantiPayClient = require('../clients/santipay.client');

const buildSantiPayService = ({ repository }) => {
  const client = createSantiPayClient();

  const initiatePayment = async ({ userId, amount, currency, description, customerPhone, metadata }) => {
    const payload = {
      amount,
      currency,
      description,
      customer_phone: customerPhone,
      metadata
    };

    try {
      const { data } = await client.post('/payments', payload);
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
      throw new AppError(`SantiPay initialization failed: ${error.message}`, error.response?.status || 502);
    }
  };

  const verifyPayment = async ({ reference }) => {
    try {
      const { data } = await client.get(`/payments/${reference}`);
      const status = data?.data?.status;
      await repository.updateStatusByReference(reference, status, { verification: data });
      return data;
    } catch (error) {
      throw new AppError(`SantiPay verification failed: ${error.message}`, error.response?.status || 502);
    }
  };

  const listPayments = (userId) => repository.listByUser(userId);

  return {
    initiatePayment,
    verifyPayment,
    listPayments
  };
};

module.exports = buildSantiPayService;
