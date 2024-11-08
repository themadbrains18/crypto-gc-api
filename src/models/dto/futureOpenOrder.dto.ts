/**
 * Data Transfer Object (DTO) for representing an open future order.
 * 
 * This interface defines the structure for an open order in a futures market, 
 * including details about the position, order type, leverage, price, and status.
 * 
 * @interface futureOpenOrderDto
 * 
 * @property {string} [id] - The unique identifier for the order. Optional.
 * @property {string} [position_id] - The unique identifier for the associated position.
 * @property {string} [user_id] - The unique identifier of the user who placed the order.
 * @property {string} [symbol] - The trading pair symbol (e.g., "BTC/USD").
 * @property {string} [side] - The side of the order: "open long", "open short", "close long", "close short".
 * @property {string} [type] - The type of the order (e.g., "limit", "take profit market", "stop market").
 * @property {Date} [time] - The timestamp when the order was placed.
 * @property {string} [amount] - The amount of the order (e.g., limit order amount, position to close).
 * @property {number} [price_usdt] - The price for a limit order in USDT.
 * @property {string} [trigger] - The trigger for take-profit (TP) or stop-loss (SL) orders.
 * @property {string} [reduce_only] - Specifies whether the order is "reduce only" (e.g., for TP/SL orders).
 * @property {string} [post_only] - Whether the order is "post only" (i.e., it will only post to the order book and not fill immediately).
 * @property {boolean} [status] - The status of the order, indicating whether it is active or not.
 * @property {number} [leverage] - The leverage used for the order.
 * @property {number} [market_price] - The current market price of the asset when the order was placed.
 * @property {number} [liq_price] - The liquidation price for the position.
 * @property {number} [margin] - The margin required to open the order.
 * @property {string} [order_type] - The type of order (e.g., "limit", "market").
 * @property {string} [leverage_type] - The type of leverage used (e.g., "isolated", "cross").
 * @property {string} [coin_id] - The unique identifier for the coin/token in the order.
 * @property {boolean} [isDeleted] - A flag indicating whether the order has been deleted.
 * @property {number} [qty] - The quantity of the asset involved in the order.
 * @property {boolean} [isTrigger] - A flag indicating whether the order is a triggered order (e.g., for TP/SL).
 * @property {string} [position_mode] - The position mode, such as "long" or "short".
 */
export default interface futureOpenOrderDto {
    id?: string;
    position_id?: string;
    user_id?: string;
    symbol?: string;
    side?: string; // close long, close short, limit case : open long, open short
    type?: string; // e.g limit, take profit market, stop market
    time?: Date;
    amount?: string; // limit order amount, close position
    price_usdt?: number; // limit order price
    trigger?: string; // TP/SL position amount, limit order --
    reduce_only?: string; // TP/SL case Yes, limit order No
    post_only?: string; // No
    status?: boolean;
    leverage?: number;
    market_price?: number;
    liq_price?: number;
    margin?: number;
    order_type?: string;
    leverage_type?: string;
    coin_id?: string;
    isDeleted?: boolean;
    qty?: number;
    isTrigger?: boolean;
    position_mode?: string;
  }
  