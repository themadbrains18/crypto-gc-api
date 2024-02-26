import Joi from "joi";

const profileSchema = {
    create: Joi.object().keys({
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        dName: Joi.string().required(),
        uName: Joi.string().required(),
        user_id: Joi.string().required()
    }),

}

export default profileSchema;