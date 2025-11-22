const buildClient = require('../../../../core/utils/httpClient');
const env = require('../../../../core/config/env');

const createAddisPayClient = () =>
  buildClient({
    baseURL: env.providers.addispay.baseUrl,
    headers: {
      Authorization: `Bearer ${env.providers.addispay.apiKey}`
    }
  });

module.exports = createAddisPayClient;
