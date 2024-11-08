/**
 * Interface for a wallet-to-wallet transfer.
 * 
 * This interface defines the structure for a transfer of funds from one wallet to another.
 * It includes the type of wallet, the balance involved, the account type, and the token ID for the transaction.
 * 
 * @interface walletTowalletTransfer
 * 
 * @property {string} walletTtype - The type of the wallet involved in the transfer (e.g., "sending" or "receiving").
 * @property {number} balance - The amount of balance being transferred.
 * @property {string} account_type - The type of account for the wallet (e.g., "user", "admin").
 * @property {string} token_id - The unique identifier for the token involved in the transfer (e.g., a cryptocurrency or asset).
 */
export interface walletTowalletTransfer {
    walletTtype: string;
    balance: number;
    account_type: string;
    token_id: string;
}

/**
 * Data Transfer Object (DTO) for asset management.
 * 
 * This interface extends the `walletTowalletTransfer` interface, adding an optional `user_id` field to 
 * track the user associated with the wallet transfer.
 * 
 * @interface assetsDto
 * @extends walletTowalletTransfer
 * 
 * @property {string} [user_id] - The unique identifier for the user associated with the asset. Optional.
 */
export default interface assetsDto extends walletTowalletTransfer {
    user_id?: string;
}
