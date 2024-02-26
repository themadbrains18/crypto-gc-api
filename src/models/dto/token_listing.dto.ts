export default interface tokenListingDto{
    name?:string;
    user_id?:string;
    symbol: string;
    logo?: string;
    issue_price?: number;
    issue_date?: Date;
    decimals?: number;
    fees?: number;
    max_supply?: number;
    circulating_supply?: number;
    explore_link?: string;
    white_pp_link?: string;
    website_link?: string;
    introduction?: Text;
    network?: object;
    status?: boolean;
}
