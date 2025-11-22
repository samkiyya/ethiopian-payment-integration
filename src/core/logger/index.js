const pino = require('pino');
const env = require('../config/env');

const logger = pino({
  level: process.env.LOG_LEVEL || (env.nodeEnv === 'production' ? 'info' : 'debug')
});

module.exports = logger;
