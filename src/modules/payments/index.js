const { Router } = require('express');
const initChapaModule = require('./chapa');
const initSantiPayModule = require('./santipay');
const initAddisPayModule = require('./addispay');

const initPaymentsModules = ({ mysqlConnection, mongoConnection, authGuard }) => {
  const router = Router();

  const chapa = initChapaModule({ mysqlConnection, mongoConnection, authGuard });
  const santipay = initSantiPayModule({ mysqlConnection, mongoConnection, authGuard });
  const addispay = initAddisPayModule({ mysqlConnection, mongoConnection, authGuard });

  router.use('/chapa', chapa.router);
  router.use('/santipay', santipay.router);
  router.use('/addispay', addispay.router);

  return router;
};

module.exports = initPaymentsModules;
