// Error Names
const BAD_REQUEST_ERROR_NAME = 'ValidationError';
const INVALID_ID_ERROR_NAME = 'CastError';

// Result Codes
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const sendNotFound = (res, msg) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: msg });
};

const handleError = (error, res) => {
  if (error.name === INVALID_ID_ERROR_NAME) {
    return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Невалидный id' });
  }

  if (error.name === BAD_REQUEST_ERROR_NAME) {
    return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неправильно составлен запрос' });
  }

  return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
};

module.exports = {
  sendNotFound,
  handleError,
};
