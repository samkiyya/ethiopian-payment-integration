const mockClient = {
  post: jest.fn().mockResolvedValue({ data: { data: { checkout_url: 'https://pay', status: 'pending' } } }),
  get: jest.fn().mockResolvedValue({ data: { data: { status: 'success' } } })
};

const factory = () => mockClient;
factory.__client = mockClient;

jest.mock('../src/modules/payments/chapa/clients/chapa.client', () => factory);

const AppError = require('../src/core/errors/appError');
const buildChapaService = require('../src/modules/payments/chapa/services/chapa.service');
const createChapaClient = require('../src/modules/payments/chapa/clients/chapa.client');

describe('ChapaService', () => {
  const repository = {
    persist: jest.fn().mockResolvedValue({ id: 'tx-1' }),
    updateStatusByReference: jest.fn().mockResolvedValue(),
    listByUser: jest.fn().mockResolvedValue([])
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes payment and stores transaction', async () => {
    const service = buildChapaService({ repository });
    const result = await service.initiatePayment({
      userId: 'user-1',
      amount: 100,
      currency: 'ETB',
      callbackUrl: 'https://example.com/callback',
      metadata: {}
    });

    expect(repository.persist).toHaveBeenCalled();
    expect(result).toHaveProperty('checkoutUrl', 'https://pay');
  });

  it('verifies payment and updates status', async () => {
    const service = buildChapaService({ repository });
    await service.verifyPayment({ reference: 'ref-123' });
    expect(repository.updateStatusByReference).toHaveBeenCalledWith('ref-123', 'success', expect.any(Object));
  });

  it('throws AppError when client fails', async () => {
    const client = createChapaClient.__client;
    client.post.mockRejectedValueOnce(new Error('network'));
    const service = buildChapaService({ repository });

    await expect(
      service.initiatePayment({
        userId: 'user-1',
        amount: 100,
        currency: 'ETB',
        callbackUrl: 'https://example.com/callback',
        metadata: {}
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
