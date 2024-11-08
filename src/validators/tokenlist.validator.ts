import Joi from "joi";

/**
 * Validation schema for creating a new token listing.
 * @typedef {Object} tokenListingSchema
 */
const tokenListingSchema = {
  /**
   * Schema for creating a new token listing.
   * @property {string} user_id - Required. The ID of the user creating the listing.
   * @property {string} name - Required. The name of the token.
   * @property {string} symbol - Required. The symbol of the token.
   * @property {Buffer} [logo] - Optional. The logo of the token as a binary buffer in utf8 encoding.
   * @property {number} issue_price - Required. The issue price of the token, must be a positive number.
   * @property {Date} issue_date - Required. The issue date of the token.
   * @property {number} decimals - Required. The number of decimal places for the token, must be a positive integer.
   * @property {number} fees - Required. The fees associated with the token, must be a positive number.
   * @property {number} [max_supply] - Optional. The maximum supply of the token, if provided must be positive.
   * @property {number} [circulating_supply] - Optional. The circulating supply of the token, if provided must be positive.
   * @property {string} [explore_link] - Optional. A link to explore the token, must be a valid URI if provided.
   * @property {string} [white_pp_link] - Optional. A link to the whitepaper, must be a valid URI if provided.
   * @property {string} [website_link] - Optional. The official website link of the token, must be a valid URI if provided.
   * @property {string} [introduction] - Optional. A brief introduction or description of the token.
   * @property {Array<Object>} [network] - Optional. An array of network objects, each containing a contract field.
   * @property {boolean} status - Required. The status of the listing, indicating if it’s active or inactive.
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    logo: Joi.binary().encoding('utf8').optional(),
    issue_price: Joi.number().positive().required(),
    issue_date: Joi.date().required(),
    decimals: Joi.number().integer().positive().required(),
    fees: Joi.number().positive().required(),
    max_supply: Joi.number().positive().optional(),
    circulating_supply: Joi.number().positive().optional(),
    explore_link: Joi.string().uri().optional(),
    white_pp_link: Joi.string().uri().optional(),
    website_link: Joi.string().uri().optional(),
    introduction: Joi.string().optional(),
    network: Joi.array().items(
      Joi.object({
        contract: Joi.string().required()
      })
    ).optional(),
    status: Joi.boolean().required()
  })
};

export default tokenListingSchema;
