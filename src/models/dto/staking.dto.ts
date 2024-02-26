
export interface stakingDto {
    user_id: string;
    token_id: string;
    amount: number;
    apr: number;
    time_log: number;
    time_format: string;
    status: boolean;
    queue: boolean;
    redeem: boolean;
}

export interface tokenStakeDto {
    token_id: string,
    minimum_amount: number,
    apr: number,
    lockTime: [
        {
            duration: number;
            time: string;
        }
    ]
} 