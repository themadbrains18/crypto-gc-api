//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const futurePositionSchema = {
    // trigger when list new a exchange
    create: Joi.object().keys({

        symbol: Joi.string().required(),
        user_id: Joi.string().required(),
        coin_id: Joi.string().required(), //qty base then coin id otherwise usdt id
        leverage: Joi.number().optional(),
        size: Joi.number().optional(),
        entry_price: Joi.number().positive().required(),
        market_price: Joi.number().positive().required(),
        liq_price: Joi.number().optional(),
        margin: Joi.number().positive().required(),
        margin_ratio: Joi.number().positive().required(),
        pnl: Joi.number().optional(),
        realized_pnl: Joi.number().optional(),
        tp_sl: Joi.string().optional(),
        status: Joi.boolean().default("false"),
        queue : Joi.boolean().default("false"),
        direction: Joi.string().required(),
        order_type: Joi.string().required(),
        leverage_type : Joi.string().required(),
        market_type : Joi.string().required(),
        qty : Joi.number().required(),
        position_mode : Joi.string().required()
    }),

    edit: Joi.object().keys({
        id: Joi.string().required(),
        symbol: Joi.string().required(),
        user_id: Joi.string().required(),
        coin_id: Joi.string().required(), //qty base then coin id otherwise usdt id
        leverage: Joi.number().optional(),
        size: Joi.number().optional(),
        entry_price: Joi.number().positive().required(),
        market_price: Joi.number().positive().required(),
        liq_price: Joi.number().optional(),
        margin: Joi.number().positive().required(),
        margin_ratio: Joi.number().positive().required(),
        pnl: Joi.number().optional(),
        realized_pnl: Joi.number().optional(),
        tp_sl: Joi.string().optional(),
        status: Joi.boolean().default("false"),
        queue : Joi.boolean().default("false"),
        direction: Joi.string().required(),
        order_type: Joi.string().required(),
        leverage_type : Joi.string().required(),
        market_type : Joi.string().required(),
        qty : Joi.number().required()
    }),


};

export default futurePositionSchema;
