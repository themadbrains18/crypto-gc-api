import Joi from "joi";

/**
 * Validation schemas for market-related operations.
 * @typedef {Object} marketSchema
 */
const marketSchema = {

  /**
   * Schema for creating a new market order.
   * @property {string} user_id - Required. The unique identifier of the user.
   * @property {string} token_id - Required. The ID of the token being traded.
   * @property {string} market_type - Required. The type of market (e.g., spot, future).
   * @property {string} order_type - Required. The type of order (e.g., limit, market).
   * @property {number} limit_usdt - Required. The limit in USDT for the market order.
   * @property {number} volume_usdt - Required. The volume in USDT for the market order.
   * @property {number} token_amount - Required. The amount of tokens involved in the market order.
   * @property {boolean} status - Required. The status of the order (active/inactive).
   * @property {boolean} isCanceled - Required. Indicates whether the order is canceled.
   * @property {boolean} queue - Required. Indicates whether the order is in a queue.
   * @property {number} fee - Required. The fee for the market order.
   * @property {boolean} is_fee - Required. Indicates whether the fee is applied.
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    token_id: Joi.string().required(),
    market_type: Joi.string().required(),
    order_type: Joi.string().required(),
    limit_usdt: Joi.number().positive().required(),
    volume_usdt: Joi.number().positive().required(),
    token_amount: Joi.number().positive().required(),
    status: Joi.boolean().required(),
    isCanceled: Joi.boolean().required(),
    queue: Joi.boolean().required(),
    fee: Joi.number().required(),
    is_fee: Joi.boolean().required(),
  }),

  /**
   * Schema for canceling a market order.
   * @property {string} user_id - Required. The unique identifier of the user.
   * @property {string} order_id - Required. The unique identifier of the order being canceled.
   */
  cancel: Joi.object().keys({
    user_id: Joi.string().required(),
    order_id: Joi.string().required(),
  }),
};

export default marketSchema;
