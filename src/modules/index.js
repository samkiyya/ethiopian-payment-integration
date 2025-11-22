const { Router } = require('express');
const initAuthModule = require('./auth');
const initPaymentsModules = require('./payments');

const buildModulesRouter = ({ mysqlConnection, mongoConnection }) => {
  const router = Router();

  const authModule = initAuthModule({ mysqlConnection, mongoConnection });
  router.use('/auth', authModule.router);

  const paymentsRouter = initPaymentsModules({
    mysqlConnection,
    mongoConnection,
    authGuard: authModule.authGuard
  });

  router.use('/payments', paymentsRouter);

  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  return router;
};

module.exports = buildModulesRouter;
