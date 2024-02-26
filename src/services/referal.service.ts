import { userModel } from "../models";

import userRewardsDal from "../models/dal/rewards.dal";
import { userRewardInput, userRewardOuput } from "../models/model/rewards";

class ReferalService {

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

    async getUserRewards(payload:string):Promise<userRewardOuput |any>{
        return await userRewardsDal.getUserRewards(payload);
    }

    async createUserRewards(payload:userRewardInput):Promise<userRewardOuput |any>{
        return await userRewardsDal.createUserRewards(payload);
    }

    async updateUserRewards(payload:userRewardInput):Promise<userRewardOuput |any>{
        return await userRewardsDal.updateUserRewards(payload);
    }

    async getRewardsDetailById(userid : string, rewardid: string):Promise<userRewardOuput |any>{
        return await userRewardsDal.getRewardsDetailById(userid, rewardid);
    }
}

export default ReferalService;