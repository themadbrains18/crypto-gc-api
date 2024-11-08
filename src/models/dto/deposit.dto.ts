/**
 * Data Transfer Object (DTO) for storing details of a deposit transaction.
 * 
 * This interface defines the structure for a deposit transaction record, including information 
 * such as the transaction hash, block height, amount, user details, and additional network-related data.
 * 
 * @interface depositDto
 * 
 * @property {string} [id] - The unique identifier for the deposit transaction. Optional.
 * @property {string} [address] - The address to which the deposit was made.
 * @property {string} [coinName] - The name of the coin being deposited (e.g., "BTC", "ETH").
 * @property {string} [network] - The network on which the deposit was made (e.g., "Ethereum", "Binance Smart Chain").
 * @property {string} [amount] - The amount of the coin deposited.
 * @property {string} [tx_hash] - The unique transaction hash for the deposit on the blockchain.
 * @property {string} [blockHeight] - The block height at which the deposit transaction was included.
 * @property {string} [successful] - Indicates if the deposit was successful (e.g., "true" or "false").
 * @property {string} [user_id] - The unique identifier of the user who made the deposit.
 * @property {string} [transferHash] - A reference hash related to the transfer, if applicable.
 * @property {string} [contract] - The contract address if the deposit is made to a contract-based address (e.g., ERC-20 token contract).
 * @property {string} [gasFee] - The gas fee paid for processing the transaction.
 */
export default interface depositDto {
    id?: string;
    address?: string;
    coinName?: string;
    network?: string;
    amount?: string;
    tx_hash?: string;
    blockHeight?: string;
    successful?: string;
    user_id?: string;
    transferHash?: string;
    contract?: string;
    gasFee?: string;
  }
  