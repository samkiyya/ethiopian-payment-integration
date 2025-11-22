const AppError = require('../src/core/errors/appError');

jest.mock('../src/core/security/password', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password'),
  verifyPassword: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/core/security/token', () => ({
  issueToken: jest.fn().mockReturnValue('signed-token')
}));

const buildAuthService = require('../src/modules/auth/services/auth.service');
const { hashPassword, verifyPassword } = require('../src/core/security/password');
const { issueToken } = require('../src/core/security/token');

describe('AuthService', () => {
  const createRepository = () => ({
    createUser: jest.fn().mockResolvedValue({ id: '1', email: 'user@example.com' }),
    findByEmail: jest.fn(),
    findById: jest.fn().mockResolvedValue({ id: '1', email: 'user@example.com' }),
    updateLastLogin: jest.fn().mockResolvedValue()
  });

  it('registers a user when email unused', async () => {
    const repository = createRepository();
    repository.findByEmail.mockResolvedValue(null);

    const service = buildAuthService({ userRepository: repository });
    const result = await service.register({
      email: 'user@example.com',
      password: 'Password123',
      firstName: 'Sara',
      lastName: 'Bekele'
    });

    expect(hashPassword).toHaveBeenCalledWith('Password123');
    expect(repository.createUser).toHaveBeenCalled();
    expect(result.email).toBe('user@example.com');
  });

  it('throws when registering duplicate email', async () => {
    const repository = createRepository();
    repository.findByEmail.mockResolvedValue({ id: '1' });

    const service = buildAuthService({ userRepository: repository });

    await expect(
      service.register({ email: 'user@example.com', password: 'Password123', firstName: 'A', lastName: 'B' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('logs in valid user', async () => {
    const repository = createRepository();
    repository.findByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      role: 'user'
    });

    const service = buildAuthService({ userRepository: repository });
    const result = await service.login({ email: 'user@example.com', password: 'Password123' });

    expect(verifyPassword).toHaveBeenCalledWith('Password123', 'hashed-password');
    expect(issueToken).toHaveBeenCalledWith({ sub: '1', role: 'user' });
    expect(result.token).toBe('signed-token');
  });

  it('rejects invalid password', async () => {
    verifyPassword.mockResolvedValueOnce(false);
    const repository = createRepository();
    repository.findByEmail.mockResolvedValue({ id: '1', passwordHash: 'hash' });

    const service = buildAuthService({ userRepository: repository });

    await expect(service.login({ email: 'user@example.com', password: 'wrong' })).rejects.toBeInstanceOf(AppError);
  });
});
