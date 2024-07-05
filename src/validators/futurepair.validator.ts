//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const futuretradePairSchema = {
    // trigger when list new a exchange
    create: Joi.object().keys({

        coin_id: Joi.string().required(),
        usdt_id: Joi.string().required(),
        coin_symbol: Joi.string().required(),
        usdt_symbol: Joi.string().required(),
        coin_fee: Joi.number().optional(),
        usdt_fee: Joi.number().optional(),
        coin_min_trade: Joi.number().positive().required(),
        usdt_min_trade: Joi.number().positive().required(),
        coin_max_trade: Joi.number().positive().required(),
        status: Joi.boolean().default("false"),
    }),

    edit: Joi.object().keys({
        id: Joi.string().required(),
        coin_id: Joi.string().required(),
        usdt_id: Joi.string().required(),
        coin_symbol: Joi.string().required(),
        usdt_symbol: Joi.string().required(),
        coin_fee: Joi.number().optional(),
        usdt_fee: Joi.number().optional(),
        coin_min_trade: Joi.number().positive().required(),
        usdt_min_trade: Joi.number().positive().required(),
        coin_max_trade: Joi.number().positive().required(),
        status: Joi.boolean().default("false"),
    }),


};

export default futuretradePairSchema;
