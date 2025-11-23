import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const screenSchema = Joi.object({
  name: Joi.string().max(100).required(),
  isActive: Joi.boolean()
});

export const playlistSchema = Joi.object({
  name: Joi.string().max(100).required(),
  itemUrls: Joi.array().items(
    Joi.string().uri().max(500)
  ).max(10)
});