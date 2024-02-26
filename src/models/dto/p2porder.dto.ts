export default interface P2POrderDto{
  post_id: string;
  sell_user_id?: string;
  buy_user_id: string;
  token_id?: string;
  price?: number;
  quantity: number;
  spend_amount: number;
  receive_amount?: number;
  spend_currency?: string;
  receive_currency?: string;
  p_method?: string;
  status?:string;
  type?: string;
}