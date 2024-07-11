export default interface profitLossDto {
    id?: string;
    contract?: string;
    position_id?: string;
    user_id?: string;
    qty?: string;
    trigger_profit?: number;
    trigger_loss?: number;
    profit_value?: number;
    loss_value?: number;
    trade_type?: string;
}