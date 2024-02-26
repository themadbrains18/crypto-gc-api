//* validators/register.validator.js
import Joi from "joi";

const registerSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    username: Joi.string().min(1).required(),
    password: Joi.string().min(4).required(),
    name: Joi.string().min(1).required(),
    surname: Joi.string().min(1).required()
});

export default registerSchema;