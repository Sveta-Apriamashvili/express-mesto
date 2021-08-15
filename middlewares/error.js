const ErrorFormatter = require('../utils/error_formatter');

const errorsHandler = (err, req, res, next) => {
  const error = ErrorFormatter.formatError(err);
  const status = error.statusCode;
  const { message } = error;

  res.status(status).send({ message });

  next();
};

module.exports = errorsHandler;
