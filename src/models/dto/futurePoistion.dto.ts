export default interface futurePositionDto {
    id?: string;
    symbol?: string;
    user_id?: string;
    coin_id?: string;
    leverage?: number;
    size: number;
    entry_price: number;
    market_price: number;
    liq_price?: number;
    margin: number;
    margin_ratio?: number;
    pnl?: number;
    realized_pnl: number;
    tp_sl?: string;
    status?: boolean;
    queue?: boolean;
    position?:string;
    position_mode?:string;
    order_type?:string;
    leverage_type?:string;
    market_type?:string;
    direction?:string;
    qty:number;
    assets_margin:number;
}