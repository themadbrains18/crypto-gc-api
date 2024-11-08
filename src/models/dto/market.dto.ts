/**
 * Data Transfer Object (DTO) for representing a user's market order.
 * 
 * This interface defines the structure for a market order, including information 
 * about the token, order type, limits, fees, and order status.
 * 
 * @interface marketDto
 * 
 * @property {string} user_id - The unique identifier for the user making the market order.
 * @property {string} [token_id] - The unique identifier for the token involved in the market order (optional).
 * @property {string} [market_type] - The type of market (e.g., spot, futures) for the order (optional).
 * @property {string} order_type - The type of order being placed (e.g., limit, market).
 * @property {number} limit_usdt - The limit value in USDT for the order (e.g., price at which the order should be placed).
 * @property {number} volume_usdt - The volume in USDT that the order will represent (e.g., total value of the order).
 * @property {number} token_amount - The amount of the token to be traded in the market order.
 * @property {boolean} [status] - The status of the market order (optional).
 * @property {boolean} [isCanceled] - The cancellation status of the market order (optional).
 * @property {boolean} [queue] - Indicates whether the order is in a queue (optional).
 * @property {number} [fee] - The fee associated with the order (optional).
 * @property {boolean} [is_fee] - Indicates whether the fee is applicable (optional).
 */
export interface marketDto {
    user_id: string;
    token_id?: string;
    market_type?: string;
    order_type: string;
    limit_usdt: number;
    volume_usdt: number;
    token_amount: number;
    status?: boolean;
    isCanceled?: boolean;
    queue?: boolean;
    fee?: number;
    is_fee?: boolean;
}
