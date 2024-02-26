import Joi from "joi";

const p2pOrderSchema = {
    create: Joi.object().keys({
        post_id: Joi.string().required(),
        sell_user_id: Joi.string().required(),
        buy_user_id: Joi.string().required(),
        token_id: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().positive().required(),
        spend_amount: Joi.number().positive().required(),
        receive_amount: Joi.number().positive().required(),
        spend_currency: Joi.string().required(),
        receive_currency: Joi.string().required(),
        p_method: Joi.string().optional().allow(''),
        status: Joi.string().required(),
        type: Joi.string().required()
    }),
    cancel : Joi.object().keys({
        order_id : Joi.string().required(),
        user_id : Joi.string().required()
    }),
    update : Joi.object().keys({
        order_id : Joi.string().required(),
    }),
    release : Joi.object().keys({
        order_id : Joi.string().required(),
        user_id : Joi.string().required(),
        fundcode : Joi.number().positive().required()
    })
}

export default p2pOrderSchema;