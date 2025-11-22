const buildAuthRoutes = require('./http/auth.routes');
const defineUserModel = require('./models/user.mysql');
const getUserProfileModel = require('./models/user.mongo');
const buildUserRepository = require('./repositories/user.repository');
const buildAuthService = require('./services/auth.service');
const buildAuthGuard = require('./middleware/authGuard');

const initAuthModule = ({ mysqlConnection, mongoConnection }) => {
  const userModel = defineUserModel(mysqlConnection);
  const userProfileModel = getUserProfileModel();
  const userRepository = buildUserRepository({ userModel, userProfileModel });
  const authService = buildAuthService({ userRepository });
  const authGuard = buildAuthGuard({ userRepository });
  const router = buildAuthRoutes({ authService, authGuard });

  return {
    router,
    authGuard,
    userModel
  };
};

module.exports = initAuthModule;
