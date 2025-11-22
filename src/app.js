require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const env = require('./core/config/env');
const { notFound, errorHandler } = require('./core/middleware/error');
const buildModulesRouter = require('./modules');

const createApp = ({ mysqlConnection, mongoConnection }) => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true
    })
  );
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (mysqlConnection && mongoConnection) {
    app.use('/api/v1', buildModulesRouter({ mysqlConnection, mongoConnection }));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
