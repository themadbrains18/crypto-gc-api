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
