const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../logger');

const connectMongo = async () => {
  const uri = env.mongo.uri;
  await mongoose.connect(uri, {
    autoIndex: true
  });
  logger.info(`Connected to MongoDB at ${uri}`);
  return mongoose.connection;
};

module.exports = connectMongo;
