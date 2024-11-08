/**
 * Data Transfer Object (DTO) for storing details of a user's future position history.
 * 
 * This interface defines the structure for recording the history of positions taken by a user in the futures market,
 * including relevant information such as the symbol, market price, order type, and position status.
 * 
 * @interface futurePositionHistoryDto
 * 
 * @property {string} [id] - The unique identifier for the future position history record. Optional.
 * @property {string} [position_id] - The unique identifier for the position associated with the trade.
 * @property {string} [symbol] - The trading pair symbol (e.g., "BTC/USD").
 * @property {string} [user_id] - The unique identifier of the user who opened the position.
 * @property {string} [coin_id] - The unique identifier for the coin or token involved in the position.
 * @property {number} [market_price] - The market price at which the position was opened.
 * @property {boolean} [status] - The status of the position, indicating whether it's active or closed.
 * @property {string} [direction] - The direction of the position (e.g., "long" or "short").
 * @property {string} [order_type] - The type of the order (e.g., "limit" or "market").
 * @property {string} [market_type] - The type of the market (e.g., "spot" or "futures").
 * @property {boolean} [isDeleted] - Indicates if the position history record has been deleted. Optional.
 * @property {number} [qty] - The quantity of the asset involved in the position.
 */
export default interface futurePositionHistoryDto {
    id?: string;
    position_id?: string;
    symbol?: string;
    user_id?: string;
    coin_id?: string;
    market_price?: number;
    status?: boolean;
    direction?: string;
    order_type?: string;
    market_type?: string;
    isDeleted?: boolean;
    qty?: number;
  }
  