/**
 * Data Transfer Object (DTO) for a token conversion transaction.
 * 
 * This interface defines the structure for storing details about a user's token conversion,
 * including the tokens involved, conversion rates, and amounts.
 * 
 * @interface convertDto
 * 
 * @property {string} [id] - The unique identifier for the conversion transaction. Optional.
 * @property {string} user_id - The unique identifier of the user initiating the conversion.
 * @property {string} converted - The token type that is being converted. E.g., "BTC", "ETH".
 * @property {string} received - The token type that is received after conversion. E.g., "USDT".
 * @property {number} fees - The fees applied during the conversion transaction.
 * @property {string} conversion_rate - The conversion rate applied to the transaction (e.g., "1 BTC = 20000 USDT").
 * @property {string} consumption_token_id - The unique identifier of the token being consumed in the conversion.
 * @property {string} gain_token_id - The unique identifier of the token being received after conversion.
 * @property {number} consumption_amount - The amount of the consumption token used for the conversion.
 * @property {number} gain_amount - The amount of the gain token received after conversion.
 */
export default interface convertDto {
  id?: string;
  user_id: string;
  converted: string;
  received: string;
  fees: number;
  conversion_rate: string;
  consumption_token_id: string;
  gain_token_id: string;
  consumption_amount: number;
  gain_amount: number;
}
