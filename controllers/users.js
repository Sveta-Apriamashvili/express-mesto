const User = require('../model/user');

const BAD_REQUEST_ERROR_NAME = 'ValidationError';
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

/* eslint-disable no-underscore-dangle */
function _sendNotFound(res) {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
}

function _handleDefaultError(res) {
  return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
}

function _handleError(error, res) {
  if (error.name === BAD_REQUEST_ERROR_NAME) {
    return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неправильно составлен запрос' });
  }

  return _handleDefaultError(res);
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => _handleDefaultError(res));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return _sendNotFound(res);

      return res.send(user);
    })
    .catch(() => _handleDefaultError(res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => _handleError(err, res));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => _handleError(err, res));
};

const updateAvatar = (req, res) => {
  const avatar = req.body;

  return User.findByIdAndUpdate(req.params.userId, avatar, { new: true })
    .then((user) => res.send(user))
    .catch((err) => _handleError(err, res));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
