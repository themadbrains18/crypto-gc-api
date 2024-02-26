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
