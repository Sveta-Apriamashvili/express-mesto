const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method),
  }).unknown(),
}), createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }).unknown(),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }).unknown(),
}), addCardLike);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }).unknown(),
}), deleteCardLike);

module.exports = router;
