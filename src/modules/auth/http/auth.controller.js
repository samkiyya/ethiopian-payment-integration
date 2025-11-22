const env = require('../../../core/config/env');
const response = require('../../../core/http/response');

const buildAuthController = ({ authService }) => {
  const register = async (req, res) => {
    const user = await authService.register(req.body);
    return response.created(res, user, 'User registered');
  };

  const login = async (req, res) => {
    const result = await authService.login(req.body);
    res.cookie(env.jwt.cookieName, result.token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax'
    });
    return response.ok(res, result, 'Login successful');
  };

  const profile = async (req, res) => {
    const user = await authService.profile(req.user.id);
    return response.ok(res, user, 'Profile fetched');
  };

  const logout = async (req, res) => {
    res.clearCookie(env.jwt.cookieName);
    return response.ok(res, null, 'Logged out');
  };

  return {
    register,
    login,
    profile,
    logout
  };
};

module.exports = buildAuthController;
