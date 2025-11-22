const { Sequelize } = require('sequelize');
const env = require('../config/env');

const createMysqlConnection = () => {
  if (env.nodeEnv === 'test' && process.env.TEST_DB !== 'mysql') {
    return new Sequelize('sqlite::memory:', {
      logging: false
    });
  }

  return new Sequelize(env.mysql.database, env.mysql.username, env.mysql.password, {
    host: env.mysql.host,
    port: env.mysql.port,
    dialect: 'mysql',
    logging: env.mysql.logging ? console.log : false,
    define: {
      underscored: true,
      timestamps: true
    }
  });
};

module.exports = createMysqlConnection;
