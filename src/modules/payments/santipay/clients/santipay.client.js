const buildClient = require('../../../../core/utils/httpClient');
const env = require('../../../../core/config/env');

const createSantiPayClient = () =>
  buildClient({
    baseURL: env.providers.santipay.baseUrl,
    headers: {
      'X-API-Key': env.providers.santipay.apiKey
    }
  });

module.exports = createSantiPayClient;
