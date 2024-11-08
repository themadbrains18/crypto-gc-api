/**
 * Data Transfer Object (DTO) for representing a trade pair.
 * 
 * This interface defines the structure for representing a trade pair, which consists of two tokens,
 * their symbols, and their status in the system.
 * 
 * @interface tradePairDto
 * 
 * @property {string} [id] - The unique identifier for the trade pair (optional).
 * @property {string} [tokenOne] - The first token in the trade pair (optional).
 * @property {string} [tokenTwo] - The second token in the trade pair (optional).
 * @property {string} [symbolOne] - The symbol for the first token (e.g., BTC) (optional).
 * @property {string} [symbolTwo] - The symbol for the second token (e.g., ETH) (optional).
 * @property {string} [status] - The status of the trade pair (e.g., active, inactive) (optional).
 */
export default interface tradePairDto {
    id?: string;
    tokenOne?: string;
    tokenTwo?: string;
    symbolOne?: string;
    symbolTwo?: string;
    status?: string;
}
