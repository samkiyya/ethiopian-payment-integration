const { Router } = require('express');
const validate = require('../../../../core/middleware/validate');
const { initiateSchema } = require('../validators/request.schema');
const buildSantiPayController = require('./santipay.controller');

const buildSantiPayRoutes = ({ santipayService, authGuard }) => {
  const router = Router();
  const controller = buildSantiPayController({ santipayService });

  router.post('/', authGuard, validate(initiateSchema), controller.initiate);
  router.get('/', authGuard, controller.list);
  router.get('/:reference', authGuard, controller.verify);

  return router;
};

module.exports = buildSantiPayRoutes;
