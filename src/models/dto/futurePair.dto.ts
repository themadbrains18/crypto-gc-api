/**
 * Data Transfer Object (DTO) for representing a futures trading pair.
 * 
 * This interface defines the structure for a futures trading pair, including the 
 * associated coins, fees, and trading limits.
 * 
 * @interface futureTradePairDto
 * 
 * @property {string} [id] - The unique identifier for the trading pair.
 * @property {string} [coin_id] - The unique identifier for the coin in the trading pair.
 * @property {string} [usdt_id] - The unique identifier for the USDT in the trading pair.
 * @property {string} [coin_symbol] - The symbol for the coin (e.g., "BTC").
 * @property {string} [usdt_symbol] - The symbol for the USDT (e.g., "USDT").
 * @property {number} [coin_fee] - The trading fee for the coin in the pair.
 * @property {number} [usdt_fee] - The trading fee for USDT in the pair.
 * @property {number} [coin_min_trade] - The minimum trade amount for the coin in the pair.
 * @property {number} [usdt_min_trade] - The minimum trade amount for USDT in the pair.
 * @property {number} [coin_max_trade] - The maximum trade amount for the coin in the pair.
 * @property {boolean} [status] - The status of the trading pair, indicating if it is active or not.
 */
export default interface futureTradePairDto {
    id?: string;
    coin_id?: string;
    usdt_id?: string;
    coin_symbol?: string;
    usdt_symbol?: string;
    coin_fee?: number;
    usdt_fee?: number;
    coin_min_trade?: number;
    usdt_min_trade?: number;
    coin_max_trade?: number;
    status?: boolean;
}
