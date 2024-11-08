//* validators/token.validator.js
// schemas.js
import Joi from "joi";

/**
 * Validation schema for trade pair operations.
 * @typedef {Object} tradePairSchema
 */
const tradePairSchema = {
  /**
   * Schema for creating a new trade pair.
   * @property {string} user_id - Required. The ID of the user creating the trade pair.
   * @property {string} tokenOne - Required. The first token in the trade pair.
   * @property {string} tokenTwo - Required. The second token in the trade pair.
   * @property {string} symbolOne - Required. The symbol for the first token.
   * @property {string} symbolTwo - Required. The symbol for the second token.
   * @property {number} [maker] - Optional. The maker fee rate.
   * @property {number} [taker] - Optional. The taker fee rate.
   * @property {number} min_trade - Required. The minimum trade amount, must be a positive number.
   * @property {boolean} [status=false] - Optional. The status of the trade pair, defaults to false (inactive).
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    tokenOne: Joi.string().required(),
    tokenTwo: Joi.string().required(),
    symbolOne: Joi.string().required(),
    symbolTwo: Joi.string().required(),
    maker: Joi.number().optional(),
    taker: Joi.number().optional(),
    min_trade: Joi.number().positive().required(),
    status: Joi.boolean().default(false),
  }),

  /**
   * Schema for editing an existing trade pair.
   * @property {string} user_id - Required. The ID of the user editing the trade pair.
   * @property {string} id - Required. The unique ID of the trade pair.
   * @property {string} tokenOne - Required. The first token in the trade pair.
   * @property {string} tokenTwo - Required. The second token in the trade pair.
   * @property {string} symbolOne - Required. The symbol for the first token.
   * @property {string} symbolTwo - Required. The symbol for the second token.
   * @property {number} [maker] - Optional. The maker fee rate.
   * @property {number} [taker] - Optional. The taker fee rate.
   * @property {number} min_trade - Required. The minimum trade amount, must be a positive number.
   * @property {boolean} [status=false] - Optional. The status of the trade pair, defaults to false (inactive).
   */
  edit: Joi.object().keys({
    user_id: Joi.string().required(),
    id: Joi.string().required(),
    tokenOne: Joi.string().required(),
    tokenTwo: Joi.string().required(),
    symbolOne: Joi.string().required(),
    symbolTwo: Joi.string().required(),
    maker: Joi.number().optional(),
    taker: Joi.number().optional(),
    min_trade: Joi.number().positive().required(),
    status: Joi.boolean().default(false),
  }),
};

export default tradePairSchema;
