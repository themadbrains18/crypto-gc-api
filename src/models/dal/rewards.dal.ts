import userRewardModel, { userRewardInput, userRewardOuput } from "../model/rewards";
import BaseController from "../../controllers/main.controller";
import service from "../../services/service";
import userRewardTotalModel from "../model/rewards_total.model";

class userRewardsDal extends BaseController {


    /**
     * Get all user rewards for a given user.
     * It also checks the expiry of rewards and updates their status.
     * 
     * @param user_id - The user ID to fetch the rewards for.
     * 
     * @returns A Promise that resolves to an object containing the user's rewards list and total reward amount.
     * @throws Will throw an error if the retrieval or update fails.
     */
    async getUserRewards(user_id: string): Promise<userRewardOuput[] | any> {
        try {
            let rewards = await userRewardModel.findAll({
                where: { user_id: user_id },
                raw: true
            })

            let amount = 0;
            for await (const re of rewards) {
                if (Number(re.claim) === 1 && Number(re.status) === 0) {
                    const difference = +new Date(re.expired_on) - +new Date();
                    if (difference < 0) {
                        amount = amount + re.amount;
                        await userRewardModel.update({ status: true }, { where: { id: re.id } })
                    }
                }
            }

            if (amount > 0) {
                let rewardTotal = await userRewardTotalModel.findOne({ where: { user_id: user_id }, raw: true });
                if (rewardTotal) {
                    if (rewardTotal.order_amount > amount) {
                        await userRewardTotalModel.update({ order_amount: (rewardTotal.order_amount - amount) }, { where: { id: rewardTotal.id, user_id: user_id } });
                    }
                    else {
                        await userRewardTotalModel.update({ amount: rewardTotal.amount - (amount - rewardTotal.order_amount), order_amount: 0 }, { where: { id: rewardTotal.id, user_id: user_id } });
                    }
                }
            }

            let rewardTotal: any = await userRewardTotalModel.findOne({ where: { user_id: user_id }, raw: true });
            amount = rewardTotal.amount;

            return { list: rewards, total: amount };

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Create a new user reward.
     * Generates a referral code and updates the user's total reward balance.
     * 
     * @param payload - The user reward data including the amount and user ID.
     * 
     * @returns A Promise that resolves to the created user reward record.
     * @throws Will throw an error if the creation or update fails.
     */
    async createUserRewards(payload: userRewardInput): Promise<userRewardOuput | any> {
        try {

            payload.coupan_code = await service.otpGenerate.referalCodeGenerate();
            let rewards = await userRewardModel.create(payload);

            if (rewards) {
                const rewardTotal = await userRewardTotalModel.findOne({ where: { user_id: payload.user_id }, raw: true });
                if (rewardTotal) {
                    await userRewardTotalModel.update({ amount: rewardTotal.amount + payload.amount }, { where: { id: rewardTotal.id, user_id: payload.user_id } });
                }
                else {
                    await userRewardTotalModel.create({ amount: payload.amount, user_id: payload.user_id });
                }
            }
            return rewards;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Update an existing user reward.
     * Marks the reward as claimed and updates the user's total reward balance.
     * 
     * @param payload - The user reward data to update.
     * 
     * @returns A Promise that resolves to the updated user reward record.
     * @throws Will throw an error if the update fails.
     */
    async updateUserRewards(payload: userRewardInput): Promise<userRewardOuput | any> {
        try {

            let rewards = await userRewardModel.findOne({ where: { id: payload?.id }, raw: true });
            if (rewards) {
                let response = await userRewardModel.update({ claimed_on: payload?.claimed_on, expired_on: payload?.expired_on, claim: true }, { where: { id: payload?.id } });
                if (response) {
                    rewards = await userRewardModel.findOne({ where: { id: payload?.id }, raw: true });

                    if (rewards) {

                        const rewardTotal = await userRewardTotalModel.findOne({ where: { user_id: rewards?.user_id }, raw: true });
                        if (rewardTotal) {
                            await userRewardTotalModel.update({ amount: rewardTotal?.amount + rewards?.amount }, { where: { id: rewardTotal?.id, user_id: rewards?.user_id } });
                        }
                        else {
                            await userRewardTotalModel.create({ amount: rewards?.amount, user_id: rewards?.user_id });
                        }
                    }
                }
            }
            return rewards;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Get the details of a specific user reward by ID.
     * 
     * @param userid - The user ID.
     * @param rewardid - The reward ID to fetch the details for.
     * 
     * @returns A Promise that resolves to the user reward details.
     * @throws Will throw an error if the retrieval fails.
     */
    async getRewardsDetailById(userid: string, rewardid: string): Promise<userRewardOuput | any> {
        try {
            let record = await userRewardModel.findOne({ where: { user_id: userid, id: rewardid }, raw: true });
            return record;

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default new userRewardsDal();