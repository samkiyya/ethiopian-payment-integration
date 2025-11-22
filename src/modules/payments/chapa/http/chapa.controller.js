const response = require('../../../../core/http/response');

const buildChapaController = ({ chapaService }) => {
  const initiate = async (req, res) => {
    const data = await chapaService.initiatePayment({
      userId: req.user.id,
      ...req.body
    });
    return response.created(res, data, 'Chapa payment initialized');
  };

  const verify = async (req, res) => {
    const data = await chapaService.verifyPayment({ reference: req.params.reference });
    return response.ok(res, data, 'Chapa payment status');
  };

  const list = async (req, res) => {
    const data = await chapaService.listPayments(req.user.id);
    return response.ok(res, data, 'Chapa payments list');
  };

  return {
    initiate,
    verify,
    list
  };
};

module.exports = buildChapaController;
