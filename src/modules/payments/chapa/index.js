const defineMysqlModel = require('./models/mysql/transaction.model');
const getMongoModel = require('./models/mongo/transaction.schema');
const buildChapaRepository = require('./repositories/transaction.repository');
const buildChapaService = require('./services/chapa.service');
const buildChapaRoutes = require('./http/chapa.routes');

const initChapaModule = ({ mysqlConnection, mongoConnection, authGuard }) => {
  const mysqlModel = defineMysqlModel(mysqlConnection);
  const mongoModel = getMongoModel(mongoConnection);
  const repository = buildChapaRepository({ mysqlModel, mongoModel });
  const chapaService = buildChapaService({ repository });
  const router = buildChapaRoutes({ chapaService, authGuard });

  return {
    router,
    mysqlModel,
    mongoModel
  };
};

module.exports = initChapaModule;
