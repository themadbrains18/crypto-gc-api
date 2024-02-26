//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const tradePairSchema = {
  // trigger when list new a exchange
  create: Joi.object().keys({

    user_id: Joi.string().required(),
    tokenOne: Joi.string().required(),
    tokenTwo: Joi.string().required(),
    symbolOne: Joi.string().required(),
    symbolTwo: Joi.string().required(),
    maker: Joi.number().optional(),
    taker: Joi.number().optional(),
    min_trade: Joi.number().positive().required(),
    status: Joi.boolean().default("false"),
  }),

  edit: Joi.object().keys({
    user_id: Joi.string().required(),
    id: Joi.string().required(),
    tokenOne: Joi.string().required(),
    tokenTwo: Joi.string().required(),
    symbolOne: Joi.string().required(),
    symbolTwo: Joi.string().required(),
    maker: Joi.number().optional(),
    taker: Joi.number().optional(),
    min_trade: Joi.number().positive().required(),
    status: Joi.boolean().default("false"),
  }),


};

export default tradePairSchema;
