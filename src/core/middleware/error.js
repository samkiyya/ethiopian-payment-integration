const AppError = require('../errors/appError');
const logger = require('../logger');

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    logger.error({ err, path: req.originalUrl }, 'Unhandled exception');
  } else {
    logger.warn({ err, path: req.originalUrl }, 'Operational error');
  }

  const errors = err.details || null;
  return res.status(statusCode).json({ statusCode, message, errors });
};

module.exports = {
  notFound,
  errorHandler
};