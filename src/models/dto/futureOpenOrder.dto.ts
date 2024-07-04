export default interface futureOpenOrderDto {
    id?: string;
    position_id?: string;
    user_id?: string;
    symbol?: string;
    side?: string; // close long, close short, limit case : open long, open short
    type?: string; //e.g limit, take profit market, stop market
    time?: Date;
    amount?: string; // limit order amount, close position
    price_usdt?: number; // limit order price
    trigger?: string; // TP/SL posiotion amount , limit order --
    reduce_only?: string; // TP/SL case Yes, limit order No
    post_only?: string; //No
    status?: boolean;
    leverage?: number;
    market_price?: number;
    liq_price?: number;
    margin?: number;
    order_type?: string;
    leverage_type?: string;
    coin_id?:string;
    isDeleted?:boolean;
    qty?:number;
    isTrigger?:boolean;
    position_mode?:string;
}