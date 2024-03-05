"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rewards_1 = __importDefault(require("../model/rewards"));
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
const service_1 = __importDefault(require("../../services/service"));
const rewards_total_model_1 = __importDefault(require("../model/rewards_total.model"));
class userRewardsDal extends main_controller_1.default {
    /**
     *
     * @param payload
     * @returns
     */
    async getUserRewards(user_id) {
        try {
            let rewards = await rewards_1.default.findAll({
                where: { user_id: user_id },
                raw: true
            });
            let amount = 0;
            for await (const re of rewards) {
                if (Number(re.claim) === 1 && Number(re.status) === 0) {
                    const difference = +new Date(re.expired_on) - +new Date();
                    if (difference < 0) {
                        amount = amount + re.amount;
                        await rewards_1.default.update({ status: true }, { where: { id: re.id } });
                    }
                }
            }
            if (amount > 0) {
                let rewardTotal = await rewards_total_model_1.default.findOne({ where: { user_id: user_id }, raw: true });
                if (rewardTotal) {
                    if (rewardTotal.order_amount > amount) {
                        await rewards_total_model_1.default.update({ order_amount: (rewardTotal.order_amount - amount) }, { where: { id: rewardTotal.id, user_id: user_id } });
                    }
                    else {
                        await rewards_total_model_1.default.update({ amount: rewardTotal.amount - (amount - rewardTotal.order_amount), order_amount: 0 }, { where: { id: rewardTotal.id, user_id: user_id } });
                    }
                }
            }
            let rewardTotal = await rewards_total_model_1.default.findOne({ where: { user_id: user_id }, raw: true });
            amount = rewardTotal.amount;
            return { list: rewards, total: amount };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async createUserRewards(payload) {
        try {
            payload.coupan_code = await service_1.default.otpGenerate.referalCodeGenerate();
            let rewards = await rewards_1.default.create(payload);
            if (rewards) {
                const rewardTotal = await rewards_total_model_1.default.findOne({ where: { user_id: payload.user_id }, raw: true });
                if (rewardTotal) {
                    await rewards_total_model_1.default.update({ amount: rewardTotal.amount + payload.amount }, { where: { id: rewardTotal.id, user_id: payload.user_id } });
                }
                else {
                    await rewards_total_model_1.default.create({ amount: payload.amount, user_id: payload.user_id });
                }
            }
            return rewards;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateUserRewards(payload) {
        try {
            let rewards = await rewards_1.default.findOne({ where: { id: payload?.id }, raw: true });
            if (rewards) {
                let response = await rewards_1.default.update({ claimed_on: payload?.claimed_on, expired_on: payload?.expired_on, claim: true }, { where: { id: payload?.id } });
                if (response) {
                    rewards = await rewards_1.default.findOne({ where: { id: payload?.id }, raw: true });
                    if (rewards) {
                        const rewardTotal = await rewards_total_model_1.default.findOne({ where: { user_id: rewards?.user_id }, raw: true });
                        if (rewardTotal) {
                            await rewards_total_model_1.default.update({ amount: rewardTotal?.amount + rewards?.amount }, { where: { id: rewardTotal?.id, user_id: rewards?.user_id } });
                        }
                        else {
                            await rewards_total_model_1.default.create({ amount: rewards?.amount, user_id: rewards?.user_id });
                        }
                    }
                }
            }
            return rewards;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getRewardsDetailById(userid, rewardid) {
        try {
            let record = await rewards_1.default.findOne({ where: { user_id: userid, id: rewardid }, raw: true });
            return record;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new userRewardsDal();
