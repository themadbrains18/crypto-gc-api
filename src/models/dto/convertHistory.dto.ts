/**
 * Data Transfer Object (DTO) for storing the history of token conversions.
 * 
 * This interface defines the structure for keeping a record of each token conversion transaction
 * by a user, including details such as the type of conversion, fees, amount, and the balance after conversion.
 * 
 * @interface convertHistoryDto
 * 
 * @property {string} [id] - The unique identifier for the conversion history entry. Optional.
 * @property {string} user_id - The unique identifier of the user who performed the conversion.
 * @property {string} token_id - The unique identifier of the token involved in the conversion (e.g., "BTC", "USDT").
 * @property {string} type - The type of conversion (e.g., "conversion", "withdrawal", etc.).
 * @property {number} fees - The fees associated with the conversion.
 * @property {number} amount - The amount of the token involved in the conversion.
 * @property {number} balance - The user's balance after the conversion.
 * @property {string} convert_id - The unique identifier of the related conversion transaction (e.g., a reference to `convertDto`).
 */
export default interface convertHistoryDto {
  id?: string;
  user_id: string;
  token_id: string;
  type: string;
  fees: number;
  amount: number;
  balance: number;
  convert_id: string;
}
