const defineMysqlModel = require('./models/mysql/transaction.model');
const getMongoModel = require('./models/mongo/transaction.schema');
const buildRepository = require('./repositories/transaction.repository');
const buildSantiPayService = require('./services/santipay.service');
const buildRoutes = require('./http/santipay.routes');

const initSantiPayModule = ({ mysqlConnection, authGuard, mongoConnection }) => {
  const mysqlModel = defineMysqlModel(mysqlConnection);
  const mongoModel = getMongoModel(mongoConnection);
  const repository = buildRepository({ mysqlModel, mongoModel });
  const santipayService = buildSantiPayService({ repository });
  const router = buildRoutes({ santipayService, authGuard });

  return {
    router,
    mysqlModel,
    mongoModel
  };
};

module.exports = initSantiPayModule;
