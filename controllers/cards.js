const Card = require('../model/card');

const BAD_REQUEST_ERROR_NAME = 'ValidationError';
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

/* eslint-disable no-underscore-dangle */
function _sendNotFound(res) {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
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

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => _handleDefaultError(res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => _handleError(err, res));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) return _sendNotFound(res);

      return res.send(card);
    })
    .catch(() => _handleDefaultError(res));
};

// eslint-disable-next-line no-unused-vars
const addCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) return _sendNotFound(res);

    return res.send(card);
  })
  .catch(() => _handleDefaultError(res));

// eslint-disable-next-line no-unused-vars
const deleteCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) return _sendNotFound(res);

    return res.send(card);
  })
  .catch(() => _handleDefaultError(res));

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
