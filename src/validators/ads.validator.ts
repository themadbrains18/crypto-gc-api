import Joi from "joi";

const adsPostSchema={
    create : Joi.object().keys({
        user_id: Joi.string().required(),
        token_id: Joi.string().required(),
        price: Joi.number().positive().positive().required(),
        quantity: Joi.number().positive().positive().required(),
        min_limit: Joi.number().positive().positive().required(),
        max_limit: Joi.number().positive().positive().required(),
        p_method: Joi.array().items({"upm_id":Joi.string().required()}).required(),
        payment_time: Joi.string().required(),
        remarks: Joi.string().optional().allow(''),
        complete_kyc: Joi.boolean().optional().allow(''),
        min_btc: Joi.boolean().optional().allow(''),
        status: Joi.boolean().optional().allow(''),
        fundcode:Joi.string().optional().allow(''),
        condition:Joi.string().optional().allow(''),
        auto_reply:Joi.string().optional().allow(''),
        price_type:Joi.string().optional()
    }),

    edit : Joi.object().keys({
        id: Joi.string().required(),
        user_id: Joi.string().required(),
        token_id: Joi.string().required(),
        price: Joi.number().positive().positive().required(),
        quantity: Joi.number().positive().positive().required(),
        min_limit: Joi.number().positive().positive().required(),
        max_limit: Joi.number().positive().positive().required(),
        p_method: Joi.array().items({"upm_id":Joi.string().required()}).required(),
        payment_time: Joi.string().required(),
        remarks: Joi.string().optional().allow(''),
        complete_kyc: Joi.boolean().optional().allow(''),
        min_btc: Joi.boolean().optional().allow(''),
        status: Joi.boolean().optional().allow(''),
        fundcode:Joi.string().optional().allow(''),
        condition:Joi.string().optional().allow(''),
        auto_reply:Joi.string().optional().allow(''),
        price_type:Joi.string().optional()
    }),

    status : Joi.object().keys({
        post_id: Joi.string().required(),
        user_id: Joi.string().required()
    })
}

export default adsPostSchema;