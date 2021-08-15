const jwt = require('jsonwebtoken');
const UnauthorizedClientError = require('../utils/unauthorized-client-error');

const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';

const auth = (req, res, next) => {
  if (!req.cookies.jwt) throw new UnauthorizedClientError(UNAUTHORIZED_ERROR_MESSAGE);

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secretno04en');
  } catch (err) {
    throw new UnauthorizedClientError(UNAUTHORIZED_ERROR_MESSAGE);
  }

  req.user = payload;

  next();
};

module.exports = auth;
