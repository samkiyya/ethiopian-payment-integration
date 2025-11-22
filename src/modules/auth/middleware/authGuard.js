const env = require('../../../core/config/env');
const AppError = require('../../../core/errors/appError');
const { verifyToken } = require('../../../core/security/token');

const buildAuthGuard = ({ userRepository }) => async (req, res, next) => {
  try {
    const token =
      req.cookies?.[env.jwt.cookieName] ||
      (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = verifyToken(token);
    const user = await userRepository.findById(decoded.sub);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = buildAuthGuard;
