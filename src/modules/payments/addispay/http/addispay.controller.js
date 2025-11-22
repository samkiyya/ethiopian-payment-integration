const response = require('../../../../core/http/response');

const buildAddisPayController = ({ addispayService }) => {
  const initiate = async (req, res) => {
    const data = await addispayService.initiatePayment({ userId: req.user.id, ...req.body });
    return response.created(res, data, 'AddisPay payment initialized');
  };

  const verify = async (req, res) => {
    const data = await addispayService.verifyPayment({ reference: req.params.reference });
    return response.ok(res, data, 'AddisPay payment status');
  };

  const list = async (req, res) => {
    const data = await addispayService.listPayments(req.user.id);
    return response.ok(res, data, 'AddisPay payments list');
  };

  return {
    initiate,
    verify,
    list
  };
};

module.exports = buildAddisPayController;
