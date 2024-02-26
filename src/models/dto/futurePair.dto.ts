export default interface futureTradePairDto {
    id?: string;
    coin_id?: string;
    usdt_id?: string;
    coin_symbol?: string;
    usdt_symbol?: string;
    coin_fee?: number;
    usdt_fee?: number;
    coin_min_trade?: number;
    usdt_min_trade?: number;
    status?: boolean;

}