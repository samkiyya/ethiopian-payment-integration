const { Router } = require('express');
const validate = require('../../../core/middleware/validate');
const buildAuthController = require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.schema');

const buildAuthRoutes = ({ authService, authGuard }) => {
  const router = Router();
  const controller = buildAuthController({ authService });

  router.post('/register', validate(registerSchema), controller.register);
  router.post('/login', validate(loginSchema), controller.login);
  router.get('/profile', authGuard, controller.profile);
  router.post('/logout', authGuard, controller.logout);

  return router;
};

module.exports = buildAuthRoutes;
