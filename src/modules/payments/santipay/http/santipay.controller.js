const response = require('../../../../core/http/response');

const buildSantiPayController = ({ santipayService }) => {
  const initiate = async (req, res) => {
    const data = await santipayService.initiatePayment({ userId: req.user.id, ...req.body });
    return response.created(res, data, 'SantiPay payment initialized');
  };

  const verify = async (req, res) => {
    const data = await santipayService.verifyPayment({ reference: req.params.reference });
    return response.ok(res, data, 'SantiPay payment status');
  };

  const list = async (req, res) => {
    const data = await santipayService.listPayments(req.user.id);
    return response.ok(res, data, 'SantiPay payments list');
  };

  return {
    initiate,
    verify,
    list
  };
};

module.exports = buildSantiPayController;
