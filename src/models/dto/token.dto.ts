/**
 * Data Transfer Object (DTO) for token details.
 * 
 * This interface defines the structure for representing the details of a token, including 
 * information about its symbol, full name, withdrawal limits, networks, and pricing.
 * 
 * @interface tokenDto
 * 
 * @property {string} [id] - The unique identifier for the token (optional).
 * @property {string} symbol - The symbol of the token (e.g., BTC, ETH).
 * @property {string} fullName - The full name of the token (e.g., Bitcoin, Ethereum).
 * @property {string} minimum_withdraw - The minimum withdrawal amount allowed for the token.
 * @property {string} decimals - The number of decimals the token supports.
 * @property {string} tokenType - The type of token (e.g., ERC20, BEP2).
 * @property {string} [image] - A URL to the token's image or logo (optional).
 * @property {boolean} status - The current status of the token (true = active, false = inactive).
 * @property {Array} networks - An array of network objects where the token is available.
 * 
 * @property {object} networks[].id - The unique identifier for the network.
 * @property {number} networks[].fee - The fee associated with transactions on the network.
 * @property {number} networks[].decimal - The decimal precision for the token on the network.
 * @property {string} networks[].contract - The contract address of the token on the network.
 * 
 * @property {number} price - The current price of the token (double value).
 * @property {string} min_price - The minimum price of the token in a given period.
 * @property {string} max_price - The maximum price of the token in a given period.
 * @property {string} [type] - The type of the token (optional).
 * @property {number} [fees] - The transaction fee associated with the token (optional).
 */
export default interface tokenDto {
  id?: string;
  symbol: string;
  fullName: string;
  minimum_withdraw: string;
  decimals: string;
  tokenType: string;
  image?: string;
  status: boolean;
  networks: [
    {
      id: string;
      // abi: object;
      fee: number;
      decimal: number;
      contract: string;
    }
  ];
  price: number; // DOUBLE
  min_price: string;
  max_price: string;
  type?: string;
  fees?: number;
}
