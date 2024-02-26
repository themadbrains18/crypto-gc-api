export default interface futurePositionHistoryDto {
    id?: string;
    position_id?: string;
    symbol?: string;
    user_id?: string;
    coin_id?: string;
    market_price?: number;
    status?: boolean;
    direction?: string;
    order_type?: string;
    market_type?: string;
    isDeleted?: boolean;
    qty?: number;
}