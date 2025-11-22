const { Router } = require('express');
const validate = require('../../../../core/middleware/validate');
const { initiateSchema } = require('../validators/request.schema');
const buildChapaController = require('./chapa.controller');

const buildChapaRoutes = ({ chapaService, authGuard }) => {
  const router = Router();
  const controller = buildChapaController({ chapaService });

  router.post('/', authGuard, validate(initiateSchema), controller.initiate);
  router.get('/', authGuard, controller.list);
  router.get('/:reference', authGuard, controller.verify);

  return router;
};

module.exports = buildChapaRoutes;
