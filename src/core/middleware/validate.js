const AppError = require('../errors/appError');

const validate = (schema, property = 'body') => (req, res, next) => {
  const target = req[property];
  const options = { abortEarly: false, stripUnknown: true }; 
  const { error, value } = schema.validate(target, options);

  if (error) {
    const details = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path.join('.')
    }));
    return next(new AppError('Validation failed', 422, details));
  }

  req[property] = value;
  return next();
};

module.exports = validate;
