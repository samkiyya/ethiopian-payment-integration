const path = require('path');
const dotenv = require('dotenv');

if (!process.env.NO_DOTENV) {
  const envFile = process.env.ENV_FILE || '.env';
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
}

const list = (value, fallback = []) => {
  if (!value) return fallback;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  corsOrigins: list(process.env.CORS_ORIGIN, ['http://localhost:3000']),
  jwt: {
    secret: process.env.JWT_SECRET || 'replace-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    cookieName: process.env.TOKEN_COOKIE_NAME || 'ep_token'
  },
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DB || 'ethiopian_payments',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    logging: process.env.MYSQL_LOGGING === 'true'
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ethiopian_payments'
  },
  providers: {
    chapa: {
      apiKey: process.env.CHAPA_API_KEY || '',
      baseUrl: process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1'
    },
    santipay: {
      apiKey: process.env.SANTIPAY_API_KEY || '',
      baseUrl: process.env.SANTIPAY_BASE_URL || 'https://api.santipay.et/v1'
    },
    addispay: {
      apiKey: process.env.ADDISPAY_API_KEY || '',
      baseUrl: process.env.ADDISPAY_BASE_URL || 'https://api.addispay.et/v1'
    }
  }
};

module.exports = env;
