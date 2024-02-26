import Joi from "joi";

const settingSchema={
    updatefundcode:Joi.object().keys({
        user_id: Joi.string().required(),
        old_password: Joi.optional(),
        new_password: Joi.string().required()
    }),

    updatepassword : Joi.object().keys({
        user_id: Joi.string().required(),
        old_password: Joi.string().required(),
        new_password: Joi.string().required()
    }),
}

export default settingSchema;