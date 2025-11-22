const { Router } = require('express');
const validate = require('../../../../core/middleware/validate');
const { initiateSchema } = require('../validators/request.schema');
const buildAddisPayController = require('./addispay.controller');

const buildAddisPayRoutes = ({ addispayService, authGuard }) => {
  const router = Router();
  const controller = buildAddisPayController({ addispayService });

  router.post('/', authGuard, validate(initiateSchema), controller.initiate);
  router.get('/', authGuard, controller.list);
  router.get('/:reference', authGuard, controller.verify);

  return router;
};

module.exports = buildAddisPayRoutes;
