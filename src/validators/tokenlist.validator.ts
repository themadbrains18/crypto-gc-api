import Joi from "joi";

const tokenListingSchema = {
    create: Joi.object().keys({
        user_id: Joi.string().required(),
        name: Joi.string().required(),
        symbol: Joi.string().required(),
        logo: Joi.binary().encoding('utf8').optional(),
        issue_price: Joi.number().positive().required(),
        issue_date: Joi.required(),
        decimals: Joi.number().integer().positive().required(),
        fees: Joi.number().positive().required(),
        max_supply: Joi.number().positive().optional(),
        circulating_supply: Joi.number().positive().optional(),
        explore_link: Joi.optional(),
        white_pp_link: Joi.optional(),
        website_link: Joi.optional(),
        introduction: Joi.optional(),
        network: Joi.array().items({"contract":Joi.string().required()}).optional(),
        status: Joi.boolean().required()
    })
}

export default tokenListingSchema;