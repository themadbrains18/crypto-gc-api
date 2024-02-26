import userRewardModel, { userRewardInput, userRewardOuput } from "../model/rewards";
import BaseController from "../../controllers/main.controller";
import service from "../../services/service";
import userRewardTotalModel from "../model/rewards_total.model";

class userRewardsDal extends BaseController {

    /**
     * 
     * @param payload 
     * @returns 
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