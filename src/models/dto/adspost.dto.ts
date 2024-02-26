export default interface adsPostDto{
    id?:string;
    user_id?: string;
    token_id?: string;
    price?: number;
    quantity: number;
    min_limit?: number;
    max_limit?: number;
    p_method?: object;
    payment_time?: string;
    notes?: string;
    checked?: boolean;
    status?: boolean;
    fundcode?:string;
}