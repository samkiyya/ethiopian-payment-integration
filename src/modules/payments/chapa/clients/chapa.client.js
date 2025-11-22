const buildClient = require('../../../../core/utils/httpClient');
const env = require('../../../../core/config/env');

const createChapaClient = () =>
  buildClient({
    baseURL: env.providers.chapa.baseUrl,
    headers: {
      Authorization: `Bearer ${env.providers.chapa.apiKey}`
    }
  });

module.exports = createChapaClient;
