const AppError = require('../../../core/errors/appError');
const { hashPassword, verifyPassword } = require('../../../core/security/password');
const { issueToken } = require('../../../core/security/token');

const buildAuthService = ({ userRepository }) => {
  const register = async ({ email, password, firstName, lastName }) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.createUser({ email, passwordHash, firstName, lastName });
    return user;
  };

  const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    await userRepository.updateLastLogin(user.id);
    const token = issueToken({ sub: user.id, role: user.role });
    delete user.passwordHash;
    return { token, user };
  };

  const profile = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  };

  return {
    register,
    login,
    profile
  };
};

module.exports = buildAuthService;
