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
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => ErrorHandler.handleError(err, res));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true },
    { runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => ErrorHandler.handleError(err, res));
};

const updateAvatar = (req, res) => {
  const avatar = req.body;

  return User.findByIdAndUpdate(req.params.userId, avatar, { new: true }, { runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => ErrorHandler.handleError(err, res));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
