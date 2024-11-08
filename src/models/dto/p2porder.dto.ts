/**
 * Data Transfer Object (DTO) for Peer-to-Peer (P2P) Order information.
 * 
 * This interface defines the structure for storing details about a P2P order,
 * including information about the buyer, seller, order type, amount, and currencies involved.
 * 
 * @interface P2POrderDto
 * 
 * @property {string} post_id - The unique identifier for the post related to the order.
 * @property {string} [sell_user_id] - The optional ID of the seller. If not provided, may imply the current user is the seller.
 * @property {string} buy_user_id - The ID of the buyer initiating the order.
 * @property {string} [token_id] - The optional token identifier for the transaction.
 * @property {number} [price] - The optional price of the order, expressed in terms of the token or currency.
 * @property {number} quantity - The quantity of the item being sold or bought in the order.
 * @property {number} spend_amount - The amount of currency the buyer is spending.
 * @property {number} [receive_amount] - The optional amount of currency the buyer is receiving.
 * @property {string} [spend_currency] - The optional currency that the buyer is spending.
 * @property {string} [receive_currency] - The optional currency the buyer is receiving.
 * @property {string} [p_method] - The optional payment method chosen for the transaction (e.g., "bank transfer").
 * @property {string} [status] - The optional status of the order (e.g., "pending", "completed").
 * @property {string} [type] - The optional type of the order (e.g., "buy", "sell").
 */
export default interface P2POrderDto {
  post_id: string;
  sell_user_id?: string;
  buy_user_id: string;
  token_id?: string;
  price?: number;
  quantity: number;
  spend_amount: number;
  receive_amount?: number;
  spend_currency?: string;
  receive_currency?: string;
  p_method?: string;
  status?: string;
  type?: string;
}
