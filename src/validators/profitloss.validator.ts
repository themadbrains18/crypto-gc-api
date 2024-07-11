//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const profitLossSchema = {
    // trigger when list new a exchange
    create: Joi.object().keys({
        contract: Joi.string().required(),
        position_id: Joi.string().required(),
        user_id: Joi.string().required(),
        qty: Joi.string().required(),
        trigger_profit: Joi.number().optional(),
        trigger_loss: Joi.number().optional(),
        profit_value: Joi.number().optional(),
        loss_value: Joi.number().optional(),
        trade_type: Joi.string().required(),
    }),

    edit: Joi.object().keys({
        id: Joi.string().required(),
        contract: Joi.string().required(),
        position_id: Joi.string().required(),
        user_id: Joi.string().required(),
        qty: Joi.string().required(),
        trigger_profit: Joi.number().optional(),
        trigger_loss: Joi.number().optional(),
        profit_value: Joi.number().optional(),
        loss_value: Joi.number().optional(),
        trade_type: Joi.string().required(),
    }),


};

export default profitLossSchema;
