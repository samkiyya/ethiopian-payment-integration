const axios = require('axios');

const buildClient = ({ baseURL, headers = {}, timeout = 10000 }) =>
  axios.create({
    baseURL,
    headers,
    timeout
  });

module.exports = buildClient;
