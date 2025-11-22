const { v4: uuid } = require('uuid');
const AppError = require('../../../../core/errors/appError');
const createChapaClient = require('../clients/chapa.client');

const buildChapaService = ({ repository }) => {
  const client = createChapaClient();

  const initiatePayment = async ({ userId, amount, currency, callbackUrl, metadata, reference }) => {
    const payload = {
      amount,
      currency,
      callback_url: callbackUrl,
      tx_ref: reference || uuid(),
      ...metadata
    };

    try {
      const { data } = await client.post('/transaction/initialize', payload);
      const record = await repository.persist({
        userId,
        amount,
        currency,
        providerReference: payload.tx_ref,
        status: 'pending',
        metadata,
        checkoutUrl: data?.data?.checkout_url,
        rawRequest: payload,
        rawResponse: data
      });

      return {
        id: record.id,
        providerReference: payload.tx_ref,
        checkoutUrl: data?.data?.checkout_url
      };
    } catch (error) {
      throw new AppError(`Chapa initialization failed: ${error.message}`, error.response?.status || 502);
    }
  };

  const verifyPayment = async ({ reference }) => {
    try {
      const { data } = await client.get(`/transaction/verify/${reference}`);
      const status = data?.data?.status === 'success' ? 'success' : 'failed';
      await repository.updateStatusByReference(reference, status, { verification: data });
      return data;
    } catch (error) {
      throw new AppError(`Chapa verification failed: ${error.message}`, error.response?.status || 502);
    }
  };

  const listPayments = (userId) => repository.listByUser(userId);

  return {
    initiatePayment,
    verifyPayment,
    listPayments
  };
};

module.exports = buildChapaService;
