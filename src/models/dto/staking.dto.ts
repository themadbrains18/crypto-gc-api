/**
 * Data Transfer Object (DTO) for staking information for a specific user.
 * 
 * This interface defines the structure for tracking a user's staking activity, 
 * including the amount staked, annual percentage rate (APR), time log, and status of the staking.
 * 
 * @interface stakingDto
 * 
 * @property {string} user_id - The unique identifier of the user participating in staking.
 * @property {string} token_id - The token being staked (identified by its token ID).
 * @property {number} amount - The amount of the token staked.
 * @property {number} apr - The annual percentage rate (APR) associated with the staked token.
 * @property {number} time_log - The timestamp (in UNIX time) representing the last time the staking record was updated.
 * @property {string} time_format - The human-readable format of the time log.
 * @property {boolean} status - The status of the staking (whether active or inactive).
 * @property {boolean} queue - The queue status for redemption or pending staking.
 * @property {boolean} redeem - Flag to indicate whether the staked tokens are redeemable.
 */
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

/**
 * Data Transfer Object (DTO) for staking token configuration.
 * 
 * This interface defines the configuration for staking a specific token, 
 * including the minimum amount required for staking, APR, and possible lock times.
 * 
 * @interface tokenStakeDto
 * 
 * @property {string} token_id - The token identifier for the token that is available for staking.
 * @property {number} minimum_amount - The minimum amount required to stake the token.
 * @property {number} apr - The annual percentage rate (APR) offered for staking the token.
 * @property {Array<{ duration: number; time: string }>} lockTime - A list of lock durations and corresponding time formats, 
 *    indicating the lock-in periods for staking the token.
 */
export interface tokenStakeDto {
    token_id: string;
    minimum_amount: number;
    apr: number;
    lockTime: [
        {
            duration: number;
            time: string;
        }
    ];
}
