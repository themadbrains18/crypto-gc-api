import Joi from "joi";

/**
 * Validation schemas for future trade pair operations.
 * @typedef {Object} futuretradePairSchema
 */
const futuretradePairSchema = {

  /**
   * Schema for creating a new future trade pair.
   * @property {string} coin_id - Required. The ID of the coin involved in the pair.
   * @property {string} usdt_id - Required. The ID of USDT in the pair.
   * @property {string} coin_symbol - Required. The symbol representing the coin.
   * @property {string} usdt_symbol - Required. The symbol representing USDT.
   * @property {number} [coin_fee] - Optional. Fee percentage for the coin in the trade.
   * @property {number} [usdt_fee] - Optional. Fee percentage for USDT in the trade.
   * @property {number} coin_min_trade - Required. The minimum trade amount for the coin.
   * @property {number} usdt_min_trade - Required. The minimum trade amount for USDT.
   * @property {number} coin_max_trade - Required. The maximum trade amount for the coin.
   * @property {boolean} [status=false] - Optional. The status of the trade pair.
   */
  create: Joi.object().keys({
    coin_id: Joi.string().required(),
    usdt_id: Joi.string().required(),
    coin_symbol: Joi.string().required(),
    usdt_symbol: Joi.string().required(),
    coin_fee: Joi.number().optional(),
    usdt_fee: Joi.number().optional(),
    coin_min_trade: Joi.number().positive().required(),
    usdt_min_trade: Joi.number().positive().required(),
    coin_max_trade: Joi.number().positive().required(),
    status: Joi.boolean().default("false"),
  }),

  /**
   * Schema for editing an existing future trade pair.
   * @property {string} id - Required. The unique identifier of the trade pair.
   * @property {string} coin_id - Required. The ID of the coin involved in the pair.
   * @property {string} usdt_id - Required. The ID of USDT in the pair.
   * @property {string} coin_symbol - Required. The symbol representing the coin.
   * @property {string} usdt_symbol - Required. The symbol representing USDT.
   * @property {number} [coin_fee] - Optional. Fee percentage for the coin in the trade.
   * @property {number} [usdt_fee] - Optional. Fee percentage for USDT in the trade.
   * @property {number} coin_min_trade - Required. The minimum trade amount for the coin.
   * @property {number} usdt_min_trade - Required. The minimum trade amount for USDT.
   * @property {number} coin_max_trade - Required. The maximum trade amount for the coin.
   * @property {boolean} [status=false] - Optional. The status of the trade pair.
   */
  edit: Joi.object().keys({
    id: Joi.string().required(),
    coin_id: Joi.string().required(),
    usdt_id: Joi.string().required(),
    coin_symbol: Joi.string().required(),
    usdt_symbol: Joi.string().required(),
    coin_fee: Joi.number().optional(),
    usdt_fee: Joi.number().optional(),
    coin_min_trade: Joi.number().positive().required(),
    usdt_min_trade: Joi.number().positive().required(),
    coin_max_trade: Joi.number().positive().required(),
    status: Joi.boolean().default("false"),
  }),

};

export default futuretradePairSchema;
