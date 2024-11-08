import { userModel } from "../models";

import userRewardsDal from "../models/dal/rewards.dal";
import { userRewardInput, userRewardOuput } from "../models/model/rewards";

class ReferalService {

    /**
     * Retrieves all referrals by a specific referrer code, including direct and sub-referrals.
     * 
     * This method fetches a list of users who were referred directly by the given `refeer_code`, 
     * as well as the users referred by those direct referrals (sub-referrals). It excludes sensitive 
     * user information (e.g., password, cronStatus, etc.) from the result.
     * 
     * @param {string} refeer_code - The referral code used by the referrer.
     * @returns {Promise<any>} A list of users (direct and sub-referrals) associated with the given referral code.
     */
    async getReferalByreferCode(refeer_code: string): Promise<any> {
        try {
            let allList = [];
            let directRefer = await userModel.findAll({
                where: { refeer_code: refeer_code },
                attributes: {
                    exclude: [
                        "deletedAt",
                        "password",
                        "cronStatus",
                        "updatedAt",
                        "UID",
                        "antiphishing",
                        "secret",
                        "registerType",
                        "statusType",
                        "tradingPassword",
                        "kycstatus",
                        "TwoFA",
                    ],
                },
                raw: true
            });

            allList = directRefer;

            for await (const user of directRefer) {
                let subRefer = await userModel.findAll({
                    where: { refeer_code: user.own_code },
                    attributes: {
                        exclude: [
                            "deletedAt",
                            "password",
                            "cronStatus",
                            "updatedAt",
                            "UID",
                            "antiphishing",
                            "secret",
                            "registerType",
                            "statusType",
                            "tradingPassword",
                            "kycstatus",
                            "TwoFA",
                        ],
                    },
                    raw: true
                });

                if (subRefer) {
                    for (const subuser of subRefer) {
                        allList.push(subuser);
                    }
                }
            }

            return allList;
        } catch (error:any) {
            return error.message;
        }
    }
    
     /**
     * Retrieves referrals by a specific referrer code with pagination support (offset and limit).
     * 
     * This method fetches a paginated list of users who were referred directly by the given `refeer_code`, 
     * as well as the users referred by those direct referrals (sub-referrals), based on the provided 
     * `offset` and `limit` values. It excludes sensitive user information (e.g., password, cronStatus, etc.) 
     * from the result.
     * 
     * @param {string} refeer_code - The referral code used by the referrer.
     * @param {string} offset - The starting point for pagination.
     * @param {string} limit - The maximum number of results to return.
     * @returns {Promise<any>} A paginated list of users (direct and sub-referrals) associated with the given referral code.
     */
    async getReferalByreferCodeByLimit(refeer_code: string,offset:string,limit:string): Promise<any> {
        try {

            let offsets=parseInt(offset)
            let limits=parseInt(limit)

            let allList = [];
            let directRefer = await userModel.findAll({
                where: { refeer_code: refeer_code },
                attributes: {
                    exclude: [
                        "deletedAt",
                        "password",
                        "cronStatus",
                        "updatedAt",
                        "UID",
                        "antiphishing",
                        "secret",
                        "registerType",
                        "statusType",
                        "tradingPassword",
                        "kycstatus",
                        "TwoFA",
                    ],
                },
                raw: true,
                limit:limits,
                offset:offsets
            });

            allList = directRefer;

            for await (const user of directRefer) {
                let subRefer = await userModel.findAll({
                    where: { refeer_code: user.own_code },
                    attributes: {
                        exclude: [
                            "deletedAt",
                            "password",
                            "cronStatus",
                            "updatedAt",
                            "UID",
                            "antiphishing",
                            "secret",
                            "registerType",
                            "statusType",
                            "tradingPassword",
                            "kycstatus",
                            "TwoFA",
                        ],
                    },
                    raw: true,
                    limit:limits,
                    offset:offsets
                });

                if (subRefer) {
                    for (const subuser of subRefer) {
                        allList.push(subuser);
                    }
                }
            }

            return allList;
        } catch (error:any) {
            return error.message;
        }
    }

     /**
     * Retrieves the rewards for a specific user.
     * 
     * This method retrieves the rewards associated with a user by querying the `userRewardsDal` model. 
     * It returns the details of the user's rewards.
     * 
     * @param {string} payload - The user ID for which rewards details are being fetched.
     * @returns {Promise<userRewardOuput | any>} The rewards details associated with the user.
     */
    async getUserRewards(payload:string):Promise<userRewardOuput |any>{
        return await userRewardsDal.getUserRewards(payload);
    }

    /**
     * Creates rewards for a specific user.
     * 
     * This method creates rewards for a user by passing the `userRewardInput` payload to the `userRewardsDal` 
     * model. It persists the rewards data and returns the result.
     * 
     * @param {userRewardInput} payload - The rewards data for the user.
     * @returns {Promise<userRewardOuput | any>} The created rewards details.
     */
    async createUserRewards(payload:userRewardInput):Promise<userRewardOuput |any>{
        return await userRewardsDal.createUserRewards(payload);
    }

    /**
     * Updates rewards for a specific user.
     * 
     * This method updates the existing rewards for a user. It takes the `userRewardInput` payload and uses 
     * the `userRewardsDal` model to persist the updated rewards details.
     * 
     * @param {userRewardInput} payload - The updated rewards data for the user.
     * @returns {Promise<userRewardOuput | any>} The updated rewards details.
     */
    async updateUserRewards(payload:userRewardInput):Promise<userRewardOuput |any>{
        return await userRewardsDal.updateUserRewards(payload);
    }

     /**
     * Retrieves the details of a specific reward by user ID and reward ID.
     * 
     * This method fetches detailed information about a specific reward based on the provided user ID 
     * and reward ID. It queries the `userRewardsDal` model for the reward details.
     * 
     * @param {string} userid - The ID of the user associated with the reward.
     * @param {string} rewardid - The ID of the reward.
     * @returns {Promise<userRewardOuput | any>} The reward details for the specified user and reward ID.
     */
    async getRewardsDetailById(userid : string, rewardid: string):Promise<userRewardOuput |any>{
        return await userRewardsDal.getRewardsDetailById(userid, rewardid);
    }
}

export default ReferalService;