/**
 * Data Transfer Object (DTO) for a withdrawal request.
 * 
 * This interface defines the structure for storing information related to a user's withdrawal request,
 * including the token details, withdrawal wallet, transaction status, and the user's information.
 * 
 * @interface withdrawDto
 * 
 * @property {string} id - The unique identifier for the withdrawal request.
 * @property {string} symbol - The symbol of the token being withdrawn (e.g., BTC, ETH).
 * @property {string} tokenName - The full name of the token being withdrawn (e.g., Bitcoin, Ethereum).
 * @property {string} tokenID - The unique identifier of the token being withdrawn.
 * @property {string} withdraw_wallet - The wallet address to which the withdrawal is being made.
 * @property {number} amount - The amount of the token being withdrawn.
 * @property {string} status - The status of the withdrawal request (e.g., 'pending', 'completed').
 * @property {string} user_id - The unique identifier of the user making the withdrawal.
 * @property {string} tx_hash - The transaction hash associated with the withdrawal.
 * @property {string} tx_type - The type of transaction (e.g., 'withdrawal').
 * @property {string} fee - The fee applied to the withdrawal transaction.
 * @property {string} networkId - The unique identifier of the network (e.g., Ethereum, Bitcoin).
 * @property {string} type - The type of withdrawal (e.g., 'internal', 'external').
 * @property {string} username - The username of the user making the withdrawal.
 * @property {string} otp - The OTP (One Time Password) used for withdrawal authentication.
 * @property {number} step - The current step of the withdrawal process (e.g., verification, completion).
 */
export default interface withdrawDto {
    id: string;
    symbol: string;
    tokenName: string;
    tokenID: string;
    withdraw_wallet: string;
    amount: number;
    status: string;
    user_id: string;
    tx_hash: string;
    tx_type: string;
    fee: string;
    networkId: string;
    type: string;
    username: string;
    otp: string;
    step: number;
}
