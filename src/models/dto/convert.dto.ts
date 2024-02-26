export default interface convertDto {
  id?: string;
  user_id: string;
  converted: string;
  received: string;
  fees: number;
  conversion_rate: string;
  consumption_token_id: string;
  gain_token_id: string;
  consumption_amount : number;
  gain_amount: number;
}
