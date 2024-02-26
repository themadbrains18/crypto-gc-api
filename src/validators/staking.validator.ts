import Joi from "joi";

const stakingSchema = {
    create: Joi.object().keys({
        user_id: Joi.string().required(),
        token_id: Joi.string().required(),
        amount: Joi.number().positive().required(),
        apr: Joi.number().required(),
        time_log: Joi.number().positive().required(),
        time_format: Joi.string().required(),
        status: Joi.boolean().optional(),
        queue: Joi.boolean().optional(),
        redeem: Joi.boolean().optional()
    }),

    release: Joi.object().keys({
        id: Joi.string().required(),
        step :Joi.number().required(),
        username : Joi.string().required(),
        otp : Joi.string().required()
    }),

    adminstake: Joi.object().keys({
        token_id: Joi.string().required(),
        minimum_amount: Joi.number().positive().required(),
        apr: Joi.number().required(),
        lockTime: Joi.array().items(Joi.object({
            "duration": Joi.number().positive().required(),
            "time": Joi.string().required()
        })).required(),
        status: Joi.boolean().optional().default(true),
    }),
}

export default stakingSchema;