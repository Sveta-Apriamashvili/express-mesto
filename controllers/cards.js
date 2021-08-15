const Card = require('../model/card');
const NotFoundError = require('../utils/not-found-error');
const ForbiddenError = require('../utils/forbidden-error');

const NOT_FOUND_MSG = 'Запрашиваемая карточка не найдена';

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Карточки не существует');
      if (card.owner.toString() !== req.user._id.toString()) throw new ForbiddenError('Нельзя удалять карточки других пользователей');

      card.delete();

      return res.send(card);
    })
    .catch(next);
};

// eslint-disable-next-line no-unused-vars
const addCardLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) throw new NotFoundError(NOT_FOUND_MSG);

    return res.send(card);
  })
  .catch(next);

// eslint-disable-next-line no-unused-vars
const deleteCardLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) throw new NotFoundError(NOT_FOUND_MSG);

    return res.send(card);
  })
  .catch(next);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
