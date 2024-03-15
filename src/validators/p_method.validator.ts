import Joi from "joi";

const p_methodSchema={
    create : Joi.object().keys({
        payment_method: Joi.string().required(),
        icon: Joi.string().optional(),
        region: Joi.string().required(),
        user_id: Joi.string().optional(),
        fields: Joi.array().items({
            "name": Joi.string().required(),
            "type": Joi.string().required(),
            "label": Joi.string().optional(),
            "required": Joi.string().optional(),
            "ifoptional": Joi.string().optional(),
            "placeholder": Joi.string().optional(),
            "err_msg": Joi.string().optional(),
        }).required()
    })
}

export default p_methodSchema;