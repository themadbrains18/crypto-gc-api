/**
 * Data Transfer Object (DTO) for Ads Post.
 * 
 * This interface defines the structure of an advertisement post in the P2P system. 
 * It includes optional and required fields for the post details, including payment method, 
 * quantity, limits, and other related information for creating or managing a post.
 * 
 * @interface adsPostDto
 * 
 * @property {string} [id] - The unique identifier for the ad post. Optional.
 * @property {string} [user_id] - The ID of the user who created the ad post. Optional.
 * @property {string} [token_id] - The unique identifier for the token associated with the ad post. Optional.
 * @property {number} [price] - The price of the post. Optional.
 * @property {number} quantity - The quantity of the item in the post. This is a required field.
 * @property {number} [min_limit] - The minimum limit for the post. Optional.
 * @property {number} [max_limit] - The maximum limit for the post. Optional.
 * @property {object} [p_method] - The payment method for the transaction. Optional (object type).
 * @property {string} [payment_time] - The time by which the payment must be completed. Optional.
 * @property {string} [remarks] - Any additional remarks for the post. Optional.
 * @property {string} [auto_reply] - The automatic reply message for the post. Optional.
 * @property {boolean} [complete_kyc] - Indicates whether the user has completed the KYC (Know Your Customer) process. Optional.
 * @property {boolean} [min_btc] - A flag indicating if the ad post is for minimum Bitcoin (BTC) transactions. Optional.
 * @property {string} [fundcode] - A unique code associated with the funding method or source. Optional.
 * @property {string} [price_type] - Defines the type of price (e.g., fixed or variable). Optional.
 */
export default interface adsPostDto {
    id?: string;
    user_id?: string;
    token_id?: string;
    price?: number;
    quantity: number;
    min_limit?: number;
    max_limit?: number;
    p_method?: object;
    payment_time?: string;
    remarks?: string;
    auto_reply?: string;
    complete_kyc?: boolean;
    min_btc?: boolean;
    fundcode?: string;
    price_type?: string;
}
