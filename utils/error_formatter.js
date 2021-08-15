const BadRequestError = require('./bad-request-error');
const ConflictError = require('./conflict-error');
const ServerError = require('./server-error');

// Error Names
const BAD_REQUEST_ERROR_NAME = 'ValidationError';
const INVALID_ID_ERROR_NAME = 'CastError';
const MONGO_ERROR_NAME = 'MongoError';

const SKIPPED_ERROR_CODES = new Set([401, 403, 404]);

const formatError = (err) => {
  if (SKIPPED_ERROR_CODES.has(err.statusCode)) return err;

  if (err.name === INVALID_ID_ERROR_NAME) return new BadRequestError('Невалидный id');
  if (err.name === BAD_REQUEST_ERROR_NAME) return new BadRequestError('Неправильно составлен запрос');
  if (err.name === MONGO_ERROR_NAME && err.code === 11000) return new ConflictError('Пользователь с таким email уже существует');

  return new ServerError('Произошла ошибка');
};

module.exports = {
  formatError,
};
