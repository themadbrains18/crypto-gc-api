import Joi from "joi";

const usersSchema ={

    userAccountScanner :Joi.object().keys({
        address: Joi.string().required(),
        chainid: Joi.number().required(),
    }),

  
    
}

export default usersSchema;