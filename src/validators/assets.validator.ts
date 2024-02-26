import Joi from "joi";

const assetSchema ={

    create :Joi.object().keys({
        user_id: Joi.string().required(),
        account_type: Joi.string().required(),
        walletTtype: Joi.string().required(),
        token_id: Joi.string().required(),
        balance: Joi.number().required(),
    }),

    walletTowallet : Joi.object().keys({
        user_id: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        token_id: Joi.string().required(),
        balance: Joi.number().positive().required(),
    }),
    
}

export default assetSchema;