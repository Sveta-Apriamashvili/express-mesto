const Card = require('../model/card');
const ErrorHandler = require('../utils/error_handler');

const NOT_FOUND_MSG = 'Запрашиваемая карточка не найдена';

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => ErrorHandler.handleError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => ErrorHandler.handleError(err, res));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) return ErrorHandler.sendNotFound(res, NOT_FOUND_MSG);

      return res.send(card);
    })
    .catch((err) => ErrorHandler.handleError(err, res));
};

// eslint-disable-next-line no-unused-vars
const addCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) return ErrorHandler.sendNotFound(res, NOT_FOUND_MSG);

    return res.send(card);
  })
  .catch((err) => ErrorHandler.handleError(err, res));

// eslint-disable-next-line no-unused-vars
const deleteCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) return ErrorHandler.sendNotFound(res);

    return res.send(card);
  })
  .catch((err) => ErrorHandler.handleError(err, res));

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
