export interface marketDto {
    user_id: string;
    token_id?: string;
    market_type?: string;
    order_type: string;
    limit_usdt: number;
    volume_usdt: number;
    token_amount: number;
    status?: boolean;
    isCanceled?: boolean;
    queue?: boolean;
    fee?:number;
    is_fee?:boolean;
}
