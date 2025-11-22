const env = require('./core/config/env');
const createApp = require('./app');
const createMysqlConnection = require('./core/database/mysql');
const connectMongo = require('./core/database/mongo');
const logger = require('./core/logger');

const bootstrap = async () => {
  try {
    const mysqlConnection = createMysqlConnection();
    await mysqlConnection.authenticate();
    await mysqlConnection.sync();

    const mongoConnection = await connectMongo();

    const app = createApp({ mysqlConnection, mongoConnection });

    app.listen(env.port, () => {
      logger.info(`API listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to bootstrap server');
    process.exit(1);
  }
};

bootstrap();
