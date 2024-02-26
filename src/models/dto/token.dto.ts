export default interface tokenDto {
  id?: string;
  symbol: string;
  fullName: string;
  minimum_withdraw: string;
  decimals: string;
  tokenType: string;
  image?: string;
  status: boolean;
  networks: [
    {
      id: string;
      // abi: object;
      fee: number;
      decimal: number;
      contract: string;
    }
  ];
  price: number; //DOUBLE
  min_price: string;
  max_price: string;
  type?: string;
  fees?:number;
}
