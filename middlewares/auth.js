const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(res
      .status(401)
      .send({ message: 'Необходима авторизация' }));
  }
  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res
  //     .status(401)
  //     .send({ message: 'Необходима ' });
  // }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secretno04en');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
