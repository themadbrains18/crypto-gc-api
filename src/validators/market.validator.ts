import Joi from "joi";

const marketSchema = {
    create : Joi.object().keys({
        user_id: Joi.string().required(),
        token_id: Joi.string().required(),
        market_type:Joi.string().required(),
        order_type: Joi.string().required(),
        limit_usdt: Joi.number().positive().required(),
        volume_usdt: Joi.number().positive().required(),
        token_amount: Joi.number().positive().required(),
        status: Joi.boolean().required(),
        isCanceled: Joi.boolean().required(),
        queue: Joi.boolean().required(),
        fee: Joi.number().required(),
        is_fee : Joi.boolean().required()
    }),

    cancel: Joi.object().keys({
        user_id: Joi.string().required(),
        order_id :Joi.string().required()
    })
}

export default marketSchema;