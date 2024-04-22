import stakingModel, { stakingInput, stakingOuput } from "../model/staking.model";
import BaseController from "../../controllers/main.controller";
import { stakingDto, tokenStakeDto } from "../dto/staking.dto";
import assetModel from "../model/assets.model";
import { assetsWalletType, stakingTimeFormat } from "../../utils/interface";
import tokensModel from "../model/tokens.model";
import sequelize, { globalTokensModel, tokenstakeModel } from "../index";
import service from "../../services/service";
import { tokenstakeInput } from "../model/tokenstake.model";

class stakingDal extends BaseController {

    /**
     * 
     * @param payload 
     * @returns 
     */
    async createStaking(payload: stakingDto): Promise<stakingOuput | any> {

        try {
            let availableAssets = await assetModel.findOne({ where: { token_id: payload.token_id, user_id: payload.user_id, walletTtype: assetsWalletType.main_wallet }, raw: true });

            if (availableAssets != null && availableAssets.balance > 0 && availableAssets.balance > payload.amount) {
                let createResponse = await stakingModel.create(payload);
                let updateAssetsResponse = assetModel.update({ balance: availableAssets.balance - payload.amount }, { where: { token_id: payload.token_id, user_id: payload.user_id, walletTtype: assetsWalletType.main_wallet } });
                return createResponse;
            }

        } catch (error) {
            console.log(error);
        }

    }

    /**
     * Get all staking list
     * @returns 
     */
    async getAllStaking(user_id: string): Promise<stakingOuput | any> {
        try {
            return await stakingModel.findAll({
                where: { user_id: user_id },
                include: [
                    {
                        model: tokensModel,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "createdAt",
                                "createdAt",
                                "updatedAt",
                                "networks",
                                "minimum_withdraw",
                                "decimals",
                                "tokenType",
                                "status",
                                "price",
                                "min_price",
                                "max_price",
                                "type",
                                "maxSupply",
                                "totalSupply",
                                "circulatingSupply",
                                "rank",
                            ],
                        },
                    },
                    {
                        model: globalTokensModel,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "createdAt",
                                "createdAt",
                                "updatedAt",
                                "networks",
                                "minimum_withdraw",
                                "decimals",
                                "tokenType",
                                "status",
                                "price",
                                "min_price",
                                "max_price",
                                "type",
                                "maxSupply",
                                "totalSupply",
                                "circulatingSupply",
                                "rank",
                            ],
                        },
                    }
                ]
            })
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * Get all staking list
     * @returns 
     */
    async getAllStakingByLimit(user_id: string, offset:string, limit:string): Promise<stakingOuput | any> {
        try {
            let data= await stakingModel.findAll({
                where: { user_id: user_id },
                include: [
                    {
                        model: tokensModel,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "createdAt",
                                "createdAt",
                                "updatedAt",
                                "networks",
                                "minimum_withdraw",
                                "decimals",
                                "tokenType",
                                "status",
                                "price",
                                "min_price",
                                "max_price",
                                "type",
                                "maxSupply",
                                "totalSupply",
                                "circulatingSupply",
                                "rank",
                            ],
                        },
                    },
                    {
                        model: globalTokensModel,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "createdAt",
                                "createdAt",
                                "updatedAt",
                                "networks",
                                "minimum_withdraw",
                                "decimals",
                                "tokenType",
                                "status",
                                "price",
                                "min_price",
                                "max_price",
                                "type",
                                "maxSupply",
                                "totalSupply",
                                "circulatingSupply",
                                "rank",
                            ],
                        },
                    }
                ],
                limit:Number(limit),
                offset:Number(offset)
            },
        )

        const total = await stakingModel.count({ where: { user_id: user_id } });
        return { data: data, total: total };

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Get staking tokan data by user and token id
     * @param token_id 
     * @param user_id 
     * @returns 
     */
    async getStakingDataByTokenId(token_id: string, user_id: string): Promise<stakingOuput | any> {
        try {
            let data = await stakingModel.findAll({
                attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
                where: { user_id: user_id, token_id: token_id, redeem: false }
            })
            return data;
        } catch (error) {

        }
    }

    /**
     * Cron on all staking to update status according staking time complete
     */
    async cronStaking() {
        try {
            // console.log('staking cron call every 5 second')
            let record = await stakingModel.findAll({ where: { status: false, queue: false } });

            for await (const stak of record) {
                await stak.update({ queue: true });

                var d = new Date(stak.createdAt);
                let currentDate = new Date();

                if (stak.time_format === stakingTimeFormat.Minutes) {
                    d.setMinutes(d.getMinutes() + stak.time_log);
                }
                if (stak.time_format === stakingTimeFormat.Days) {
                    d.setDate(d.getDate() + stak.time_log);
                }
                else if (stak.time_format === stakingTimeFormat.Months) {
                    d.setMonth(d.getMonth() + stak.time_log);
                }
                else if (stak.time_format === stakingTimeFormat.Years) {
                    d.setFullYear(d.getFullYear() + stak.time_log);
                }

                let flag = await service.staking.compareDates(d, currentDate);
                // console.log(flag,'=========flag');
                if (flag === true) {
                    await stak.update({ status: true });
                }
                else {
                    await stak.update({ queue: false });
                }
            }
        } catch (error) {
            console.log(error, 'cron staking error');
        }
    }

    async releaseStaking(payload: string): Promise<stakingOuput | any> {
        try {
            let responseApi;
            let stak = await stakingModel.findOne({ where: { status: true, queue: true, redeem: false, id: payload }, raw: true });

            if (stak) {
                //==============================
                //Yearly, monthly,days annual interest rate calculation here 
                //==============================

                let assetData = await assetModel.findOne({ where: { token_id: stak.token_id, user_id: stak.user_id, walletTtype: assetsWalletType.main_wallet },raw: true });
                if(assetData){
                    let bal = assetData!.balance + (stak.amount);
                    await assetModel.update({ balance: bal },{where : {token_id: stak.token_id, user_id: stak.user_id, walletTtype: assetsWalletType.main_wallet}});
                    await stakingModel.update({ redeem: true },{where:{status: true, queue: true, redeem: false, id: payload}})
                    stak.redeem = true;
                }
            }

            return stak;
        }
        catch (error:any) {
            throw new Error(error?.message);
        }
    }

    /**
     * create Admin Staking
     * @param payload 
     * @returns 
     */
    async createAdminStaking(payload: tokenStakeDto): Promise<tokenstakeInput | any> {
        try {
            let apiStatus;
            let stake = await tokenstakeModel.findOne({ where: { token_id: payload.token_id }, raw: true });
            if (stake) {
                let createResponse = await tokenstakeModel.update(payload, { where: { id: stake?.id } });
                if (createResponse) {
                    apiStatus = await tokenstakeModel.findOne({ where: { token_id: payload.token_id }, raw: true });
                }
            }
            else {
                apiStatus = await tokenstakeModel.create(payload);
            }

            return apiStatus;

        } catch (error: any) {
            console.log(error);
            throw new Error(error.message)
        }

    }


}

export default new stakingDal();