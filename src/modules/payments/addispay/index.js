const defineMysqlModel = require('./models/mysql/transaction.model');
const getMongoModel = require('./models/mongo/transaction.schema');
const buildRepository = require('./repositories/transaction.repository');
const buildAddisPayService = require('./services/addispay.service');
const buildRoutes = require('./http/addispay.routes');

const initAddisPayModule = ({ mysqlConnection, authGuard, mongoConnection }) => {
  const mysqlModel = defineMysqlModel(mysqlConnection);
  const mongoModel = getMongoModel(mongoConnection);
  const repository = buildRepository({ mysqlModel, mongoModel });
  const addispayService = buildAddisPayService({ repository });
  const router = buildRoutes({ addispayService, authGuard });

  return {
    router,
    mysqlModel,
    mongoModel
  };
};

module.exports = initAddisPayModule;
