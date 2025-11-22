const wrap = (res, statusCode, message, data = null, meta = null) => {
  const payload = { statusCode, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const response = {
  ok: (res, data, message = 'OK', meta) => wrap(res, 200, message, data, meta),
  created: (res, data, message = 'Created', meta) => wrap(res, 201, message, data, meta),
  accepted: (res, data, message = 'Accepted', meta) => wrap(res, 202, message, data, meta)
};

module.exports = response;
