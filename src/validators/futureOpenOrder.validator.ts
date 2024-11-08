import Joi from "joi";

/**
 * Validation schemas for future open order operations.
 * @typedef {Object} futureOpenOrderSchema
 */
const futureOpenOrderSchema = {

  /**
   * Schema for creating a new future open order.
   * @property {string} [position_id] - Optional. The ID of the position.
   * @property {string} symbol - Required. The symbol for the exchange.
   * @property {string} user_id - Required. The ID of the user placing the order.
   * @property {string} side - Required. Indicates the side of the order (e.g., buy or sell).
   * @property {string} type - Required. The type of order.
   * @property {Date} [time] - Optional. The time of the order.
   * @property {string} amount - Required. The amount for the order.
   * @property {number} price_usdt - Required. The price of the asset in USDT.
   * @property {string} trigger - Required. Trigger conditions for the order.
   * @property {string} reduce_only - Required. Specifies if the order is reduce-only.
   * @property {string} post_only - Required. Specifies if the order is post-only.
   * @property {boolean} [status=false] - Optional. The status of the order.
   * @property {number} [leverage] - Optional. The leverage applied to the order.
   * @property {number} market_price - Required. The market price for the asset.
   * @property {number} [margin] - Optional. The margin applied to the order.
   * @property {number} [liq_price] - Optional. The liquidation price for the order.
   * @property {string} [order_type] - Optional. The type of order execution.
   * @property {string} [leverage_type] - Optional. The type of leverage used.
   * @property {string} coin_id - Required. The ID of the coin involved.
   * @property {boolean} [isDeleted=false] - Optional. Specifies if the order is marked as deleted.
   * @property {number} qty - Required. Quantity of the order.
   * @property {boolean} [isTrigger=false] - Optional. Specifies if the order is triggerable.
   * @property {string} position_mode - Required. The position mode for the order.
   */
  create: Joi.object().keys({
    position_id: Joi.string().optional(),
    symbol: Joi.string().required(),
    user_id: Joi.string().required(),
    side: Joi.string().required(),
    type: Joi.string().required(),
    time: Joi.date().optional(),
    amount: Joi.string().required(),
    price_usdt: Joi.number().required(),
    trigger: Joi.string().required(),
    reduce_only: Joi.string().required(),
    post_only: Joi.string().required(),
    status: Joi.boolean().default("false"),
    leverage: Joi.number().optional(),
    market_price: Joi.number().positive().required(),
    margin: Joi.number().optional(),
    liq_price: Joi.number().optional(),
    order_type: Joi.string().optional(),
    leverage_type: Joi.string().optional(),
    coin_id: Joi.string().required(),
    isDeleted: Joi.boolean().default("false"),
    qty: Joi.number().required(),
    isTrigger: Joi.boolean().default("false"),
    position_mode: Joi.string().required()
  }),

  /**
   * Schema for editing an existing future open order.
   * @property {string} id - Required. The ID of the order to be edited.
   * @property {string} [position_id] - Optional. The ID of the position.
   * @property {string} symbol - Required. The symbol for the exchange.
   * @property {string} user_id - Required. The ID of the user placing the order.
   * @property {string} side - Required. Indicates the side of the order (e.g., buy or sell).
   * @property {string} type - Required. The type of order.
   * @property {Date} time - Required. The time of the order.
   * @property {string} amount - Required. The amount for the order.
   * @property {number} price_usdt - Required. The price of the asset in USDT.
   * @property {string} trigger - Required. Trigger conditions for the order.
   * @property {string} reduce_only - Required. Specifies if the order is reduce-only.
   * @property {string} post_only - Required. Specifies if the order is post-only.
   * @property {boolean} [status=false] - Optional. The status of the order.
   * @property {number} [leverage] - Optional. The leverage applied to the order.
   * @property {number} market_price - Required. The market price for the asset.
   * @property {number} [margin] - Optional. The margin applied to the order.
   * @property {number} [liq_price] - Optional. The liquidation price for the order.
   * @property {string} [order_type] - Optional. The type of order execution.
   * @property {string} [leverage_type] - Optional. The type of leverage used.
   * @property {string} coin_id - Required. The ID of the coin involved.
   * @property {boolean} [isDeleted=false] - Optional. Specifies if the order is marked as deleted.
   * @property {number} qty - Required. Quantity of the order.
   * @property {boolean} [isTrigger=false] - Optional. Specifies if the order is triggerable.
   * @property {string} position_mode - Required. The position mode for the order.
   */
  edit: Joi.object().keys({
    id: Joi.string().required(),
    position_id: Joi.string().optional(),
    symbol: Joi.string().required(),
    user_id: Joi.string().required(),
    side: Joi.string().required(),
    type: Joi.string().required(),
    time: Joi.date().required(),
    amount: Joi.string().required(),
    price_usdt: Joi.number().required(),
    trigger: Joi.string().required(),
    reduce_only: Joi.string().required(),
    post_only: Joi.string().required(),
    status: Joi.boolean().default("false"),
    leverage: Joi.number().optional(),
    market_price: Joi.number().positive().required(),
    margin: Joi.number().optional(),
    liq_price: Joi.number().optional(),
    order_type: Joi.string().optional(),
    leverage_type: Joi.string().optional(),
    coin_id: Joi.string().required(),
    isDeleted: Joi.boolean().default("false"),
    qty: Joi.number().required(),
    isTrigger: Joi.boolean().default("false"),
    position_mode: Joi.string().required()
  }),
};

export default futureOpenOrderSchema;
