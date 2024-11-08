/**
 * Data Transfer Object (DTO) for representing a user's future position in a trading system.
 * 
 * This interface defines the structure for a user's futures position, including details such as 
 * the entry and market prices, leverage, margin, realized profit and loss, and other trading parameters.
 * 
 * @interface futurePositionDto
 * 
 * @property {string} [id] - The unique identifier for the future position.
 * @property {string} [symbol] - The symbol of the asset in the position (e.g., "BTCUSDT").
 * @property {string} [user_id] - The unique identifier for the user who holds the position.
 * @property {string} [coin_id] - The unique identifier for the coin involved in the position.
 * @property {number} [leverage] - The leverage applied to the position.
 * @property {number} size - The size (amount) of the position.
 * @property {number} entry_price - The price at which the position was entered.
 * @property {number} market_price - The current market price of the asset in the position.
 * @property {number} [liq_price] - The liquidation price for the position (if applicable).
 * @property {number} margin - The margin required to maintain the position.
 * @property {number} [margin_ratio] - The ratio of margin to the position size.
 * @property {number} [pnl] - The unrealized profit or loss from the position.
 * @property {number} realized_pnl - The realized profit or loss from the position.
 * @property {string} [tp_sl] - A reference to the Take Profit (TP) or Stop Loss (SL) associated with the position.
 * @property {boolean} [status] - The status of the position, indicating whether it is active or closed.
 * @property {boolean} [queue] - A flag indicating whether the position is in a queue (e.g., pending execution).
 * @property {string} [position] - The specific position type (e.g., "long" or "short").
 * @property {string} [position_mode] - The mode of the position (e.g., "isolated" or "cross").
 * @property {string} [order_type] - The type of order used to open the position (e.g., "limit", "market").
 * @property {string} [leverage_type] - The type of leverage applied (e.g., "fixed" or "variable").
 * @property {string} [market_type] - The type of market where the position is held (e.g., "spot", "futures").
 * @property {string} [direction] - The direction of the trade (e.g., "buy" or "sell").
 * @property {number} qty - The quantity of the asset in the position.
 * @property {number} assets_margin - The amount of margin required in assets to hold the position.
 */
export default interface futurePositionDto {
    id?: string;
    symbol?: string;
    user_id?: string;
    coin_id?: string;
    leverage?: number;
    size: number;
    entry_price: number;
    market_price: number;
    liq_price?: number;
    margin: number;
    margin_ratio?: number;
    pnl?: number;
    realized_pnl: number;
    tp_sl?: string;
    status?: boolean;
    queue?: boolean;
    position?: string;
    position_mode?: string;
    order_type?: string;
    leverage_type?: string;
    market_type?: string;
    direction?: string;
    qty: number;
    assets_margin: number;
}
