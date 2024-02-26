import assetsDto, { walletTowalletTransfer } from "../dto/assets.dto";
import assetModel, { assetOuput } from "../model/assets.model";
import tokensModel from "../model/tokens.model";
import { assetsAccountType, assetsWalletType } from "../../utils/interface";
import BaseController from "../../controllers/main.controller";
import transferhistoryModel from "../model/transferhistory.model";
import globalTokensModel from "../model/global_token.model";
import tokenstakeModel from "../model/tokenstake.model";
import tradePairModel from "../model/tradePair.model";
import futureTradePairModel from "../model/futuretrade.model";

class assetsDal extends BaseController {

    /**
     * 
     * @param payload 
     * @returns 
     */
    async createAssets(payload: assetsDto): Promise<assetOuput | any> {
        try {
            let token = tokensModel.findAll({ where: { id: payload.token_id } });
            if (<any>(await token).length > 0) {
                let assetData = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype }, raw: true });
                if (assetData) {
                    let bal = payload.balance + assetData.balance;
                    await assetModel.update({ balance: bal }, { where: { id: assetData?.id, user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype } });
                    return assetData.balance = bal;;
                }
                return await assetModel.create(payload);
            }
            token = globalTokensModel.findAll({ where: { id: payload.token_id } });
            if (<any>(await token).length > 0) {
                let assetData = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype }, raw: true });
                if (assetData) {
                    let bal = payload.balance + assetData.balance;
                    await assetModel.update({ balance: bal }, { where: { id: assetData?.id, user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype } });
                    return assetData.balance = bal;
                }
                return await assetModel.create(payload);
            }

            else {
                return new Error("token not found");
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async walletTowalletTranserfer(payload: any): Promise<assetOuput | any> {
        try {

            let token = await tokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            if (token === null) {
                token = await globalTokensModel.findOne({ where: { id: payload.token_id }, raw: true });
            }
            if (token) {

                //================================
                // get all wallet_from type assets
                //================================
                let fromAssets = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.from }, raw: true });

                //==============================
                // get all wallet_to type assets
                //==============================
                let toAssets = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.to }, raw: true });

                if (!!fromAssets && fromAssets?.balance > 0 && fromAssets.balance >= payload.balance) {

                    //==========================
                    //update wallet_from assests
                    //==========================
                    await assetModel.update({ balance: fromAssets.balance - payload.balance }, {where : {id : fromAssets?.id}});

                    //=========================================
                    // Wallet to wallet Transfer history create
                    //=========================================
                    await transferhistoryModel.create(payload);

                    //==========================
                    //update wallet_to assests 
                    //==========================
                    if (!!toAssets) {
                        await assetModel.update({ balance: toAssets.balance + payload.balance }, {where : {id : toAssets?.id}});
                        toAssets.balance = toAssets.balance + payload.balance;
                        return toAssets;
                    }
                    else {
                        let assets: assetsDto = {
                            walletTtype: payload.to,
                            balance: payload.balance,
                            account_type: '',
                            token_id: payload.token_id,
                            user_id: payload.user_id
                        };
                        let account_type = assetsAccountType.main_account;
                        if (assetsWalletType.funding_wallet === payload.to) {
                            account_type = assetsAccountType.funding_account;
                        }
                        assets.account_type = account_type;
                        return await assetModel.create(assets);
                    }
                }
                else {
                    return new Error("From Wallet Assets not found");;
                }
            }
            else {
                throw new Error("token not found");
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async assetsOverview(payload: string): Promise<assetOuput | any> {
        try {

            return await assetModel.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokensModel,
                        include: [
                            {
                                model: tokenstakeModel,
                            },
                            {
                                model: tradePairModel
                            },
                            {
                                model: futureTradePairModel
                            }
                        ]
                    },
                    {
                        model: globalTokensModel,
                        include: [
                            {
                                model: tokenstakeModel,
                            },
                            {
                                model: tradePairModel
                            },
                            {
                                model: futureTradePairModel
                            }
                        ]
                    }
                ]
            });
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    /**
     * 
     * @param payload 
     * @returns 
     */
    async assetsOverviewByLimit(payload: string, offset: string, limit: string): Promise<assetOuput | any> {
        try {
            let offsets = parseInt(offset)
            let limits = parseInt(limit)
            return await assetModel.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    }
                ],
                limit: limits,
                offset: offsets
            });
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    async getAssetsList(): Promise<assetOuput | any> {
        try {
            return await assetModel.findAll({
                include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    }
                ]
            });
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }
    async getAssetsListByLimit(offset: string, limit: string): Promise<assetOuput | any> {
        try {
            let offsets = parseInt(offset)
            let limits = parseInt(limit)
            return await assetModel.findAll({
                include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    }
                ],
                limit: limits,
                offset: offsets
            });
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async getWalletToWalletTransferHistory(payload: string): Promise<assetOuput | any> {
        try {

            return await transferhistoryModel.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokensModel
                    }
                ]
            });
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }
}

export default new assetsDal();