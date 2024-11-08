import Joi from "joi";

/**
 * Validation schema for creating and editing future positions.
 * @typedef {Object} futurePositionSchema
 */
const futurePositionSchema = {

  /**
   * Schema for creating a new future position.
   * @property {string} symbol - Required. The trading symbol for the position.
   * @property {string} user_id - Required. The ID of the user creating the position.
   * @property {string} coin_id - Required. The ID of the coin in the position (or USDT if applicable).
   * @property {number} [leverage] - Optional. The leverage for the position.
   * @property {number} [size] - Optional. The size of the position.
   * @property {number} entry_price - Required. The entry price for the position.
   * @property {number} market_price - Required. The current market price of the asset.
   * @property {number} [liq_price] - Optional. The liquidation price.
   * @property {number} margin - Required. The margin for the position.
   * @property {number} margin_ratio - Required. The margin ratio for the position.
   * @property {number} [pnl] - Optional. Profit and loss amount.
   * @property {number} [realized_pnl] - Optional. Realized profit and loss.
   * @property {string} [tp_sl] - Optional. Take-profit or stop-loss settings.
   * @property {boolean} [status=false] - Optional. The status of the position.
   * @property {boolean} [queue=false] - Optional. Indicates if the position is queued.
   * @property {string} direction - Required. The direction of the position (e.g., "long" or "short").
   * @property {string} order_type - Required. Type of order (e.g., "limit" or "market").
   * @property {string} leverage_type - Required. Type of leverage used.
   * @property {string} market_type - Required. Type of market (e.g., "spot" or "futures").
   * @property {number} qty - Required. The quantity involved in the position.
   * @property {string} position_mode - Required. The mode of the position.
   */
  create: Joi.object().keys({
    symbol: Joi.string().required(),
    user_id: Joi.string().required(),
    coin_id: Joi.string().required(),
    leverage: Joi.number().optional(),
    size: Joi.number().optional(),
    entry_price: Joi.number().positive().required(),
    market_price: Joi.number().positive().required(),
    liq_price: Joi.number().optional(),
    margin: Joi.number().positive().required(),
    margin_ratio: Joi.number().positive().required(),
    pnl: Joi.number().optional(),
    realized_pnl: Joi.number().optional(),
    tp_sl: Joi.string().optional(),
    status: Joi.boolean().default("false"),
    queue: Joi.boolean().default("false"),
    direction: Joi.string().required(),
    order_type: Joi.string().required(),
    leverage_type: Joi.string().required(),
    market_type: Joi.string().required(),
    qty: Joi.number().required(),
    position_mode: Joi.string().required()
  }),

  /**
   * Schema for editing an existing future position.
   * @property {string} id - Required. Unique identifier for the position.
   * @property {string} symbol - Required. The trading symbol for the position.
   * @property {string} user_id - Required. The ID of the user.
   * @property {string} coin_id - Required. The ID of the coin (or USDT if applicable).
   * @property {number} [leverage] - Optional. The leverage level.
   * @property {number} [size] - Optional. The position size.
   * @property {number} entry_price - Required. The entry price.
   * @property {number} market_price - Required. Current market price.
   * @property {number} [liq_price] - Optional. Liquidation price.
   * @property {number} margin - Required. Margin for the position.
   * @property {number} margin_ratio - Required. Margin ratio.
   * @property {number} [pnl] - Optional. Profit and loss amount.
   * @property {number} [realized_pnl] - Optional. Realized profit and loss.
   * @property {string} [tp_sl] - Optional. Take-profit or stop-loss setting.
   * @property {boolean} [status=false] - Optional. Status of the position.
   * @property {boolean} [queue=false] - Optional. Indicates if queued.
   * @property {string} direction - Required. Position direction.
   * @property {string} order_type - Required. Type of order.
   * @property {string} leverage_type - Required. Type of leverage.
   * @property {string} market_type - Required. Type of market.
   * @property {number} qty - Required. Quantity involved.
   */
  edit: Joi.object().keys({
    id: Joi.string().required(),
    symbol: Joi.string().required(),
    user_id: Joi.string().required(),
    coin_id: Joi.string().required(),
    leverage: Joi.number().optional(),
    size: Joi.number().optional(),
    entry_price: Joi.number().positive().required(),
    market_price: Joi.number().positive().required(),
    liq_price: Joi.number().optional(),
    margin: Joi.number().positive().required(),
    margin_ratio: Joi.number().positive().required(),
    pnl: Joi.number().optional(),
    realized_pnl: Joi.number().optional(),
    tp_sl: Joi.string().optional(),
    status: Joi.boolean().default("false"),
    queue: Joi.boolean().default("false"),
    direction: Joi.string().required(),
    order_type: Joi.string().required(),
    leverage_type: Joi.string().required(),
    market_type: Joi.string().required(),
    qty: Joi.number().required()
  }),
};

export default futurePositionSchema;
