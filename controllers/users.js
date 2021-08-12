const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const ErrorHandler = require('../utils/error_handler');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => ErrorHandler.handleError(err, res));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return ErrorHandler.sendNotFound(res, 'Запрашиваемый пользователь не найден');

      return res.send(user);
    })
    .catch((err) => ErrorHandler.handleError(err, res));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => ErrorHandler.handleError(err, res));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) return ErrorHandler.sendNotFound(res, 'Запрашиваемый пользователь не найден');

      return res.send(user);
    })
    .catch((err) => ErrorHandler.handleError(err, res));
};

const updateAvatar = (req, res) => {
  const avatar = req.body;

  return User.findByIdAndUpdate(req.params.userId, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (!user) return ErrorHandler.sendNotFound(res, 'Запрашиваемый пользователь не найден');

      return res.send(user);
    })
    .catch((err) => ErrorHandler.handleError(err, res));
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return ErrorHandler.sendNotFound(res, 'Запрашиваемый пользователь не найден');
      }
      bcrypt.compare(password, user.password, ((error, isValid) => {
        if (error) {
          res.status(403).send({ error });
        }
        if (!isValid) {
          res.status(403).send({ error: 'Неправильный логин или пароль' });
        }
        if (isValid) {
          const token = jwt.sign({ _id: user._id }, 'secretno04en');
          res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
          }).status(200).send({ user: user.toJSON() });
        }
      }));
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
