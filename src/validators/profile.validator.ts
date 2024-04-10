import Joi from "joi";

const profileSchema = {
    create: Joi.object().keys({
        fName: Joi.string().allow('').optional(),
        lName: Joi.string().allow('').optional(),
        dName: Joi.string().required(),
        uName: Joi.string().required(),
        user_id: Joi.string().required()
    }),

}

export default profileSchema;