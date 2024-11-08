/**
 * Data Transfer Object (DTO) for token listing information.
 * 
 * This interface defines the structure for representing a token listing, 
 * which includes details about the token's name, symbol, supply, and associated links.
 * 
 * @interface tokenListingDto
 * 
 * @property {string} [name] - The name of the token (optional).
 * @property {string} [user_id] - The unique identifier of the user associated with the token (optional).
 * @property {string} symbol - The symbol of the token (e.g., BTC, ETH).
 * @property {string} [logo] - The logo URL of the token (optional).
 * @property {number} [issue_price] - The price at which the token was issued (optional).
 * @property {Date} [issue_date] - The date the token was issued (optional).
 * @property {number} [decimals] - The number of decimals supported by the token (optional).
 * @property {number} [fees] - The fee associated with the token (optional).
 * @property {number} [max_supply] - The maximum number of tokens that can ever be issued (optional).
 * @property {number} [circulating_supply] - The number of tokens currently in circulation (optional).
 * @property {string} [explore_link] - The link to explore the token (optional).
 * @property {string} [white_pp_link] - The link to the token's whitepaper (optional).
 * @property {string} [website_link] - The link to the token's official website (optional).
 * @property {Text} [introduction] - A brief introduction or description of the token (optional).
 * @property {object} [network] - The network or blockchain the token operates on (optional).
 * @property {boolean} [status] - The current status of the token (whether it is active or inactive).
 */
export default interface tokenListingDto {
    name?: string;
    user_id?: string;
    symbol: string;
    logo?: string;
    issue_price?: number;
    issue_date?: Date;
    decimals?: number;
    fees?: number;
    max_supply?: number;
    circulating_supply?: number;
    explore_link?: string;
    white_pp_link?: string;
    website_link?: string;
    introduction?: Text;
    network?: object;
    status?: boolean;
}
