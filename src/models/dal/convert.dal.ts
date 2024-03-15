import { Sequelize, Op } from "sequelize";
import convertModel, { convertOuput } from "../model/convert.model";
import convertDto from "../dto/convert.dto";
import convertHistoryDto from "../dto/convertHistory.dto";
import convertHistoryModel, { convertHistoryOuput } from "../model/convertHistory.model";
import assetModel from "../model/assets.model";
import { assetsAccountType, assetsWalletType } from "../../utils/interface";
import tokensModel from "../model/tokens.model";
import globalTokensModel from "../model/global_token.model";
import assetsDto from "../dto/assets.dto";
import userModel from "../model/users.model";

class convertDal {

    /**
     * create new convert
     * @param payload
     * @returns
     */

    async createConvert(payload: convertDto): Promise<convertOuput | any> {

        let convertResponse;
        // ===========================================
        // get  admin_ assets
        // ===========================================
        let adminUser = await userModel.findOne({ where: { role: 'admin' }, raw: true });
        
        if (adminUser) {
            let admin_assets = await assetModel.findAll({ where: { user_id: adminUser.id, walletTtype: assetsWalletType.main_wallet }, raw: true });

            let admin_consumption_asset = admin_assets.filter((item) => {
                return item.token_id === payload.gain_token_id
            })

            let admin_gain_assets: any = admin_assets.filter((item) => {
                return item.token_id === payload.consumption_token_id
            })

            let token = await tokensModel.findOne({ where: { id: payload.gain_token_id }, raw: true });
            if (!token) {
                token = await globalTokensModel.findOne({ where: { id: payload.gain_token_id }, raw: true });
            }

            if (admin_consumption_asset.length === 0) {
                return { status: false, message: `${token?.symbol} Assets not available ` };
            }
            else if (admin_consumption_asset[0].balance < 0 || admin_consumption_asset[0].balance < payload.gain_amount) {
                return { status: false, message: `${token?.symbol} Insufficiant balance` };
            }

            // ===========================================
            // convert data store db
            // ===========================================
            convertResponse = await convertModel.create(payload);

            if (convertResponse) {
                // ===========================================
                // user assets update
                // ===========================================
                let assets = await assetModel.findAll({ where: { user_id: payload.user_id, walletTtype: assetsWalletType.main_wallet }, raw: true });
                let consumption_asset = assets.filter((item) => {
                    return item.token_id === payload.consumption_token_id
                })
                let gain_assets: any = assets.filter((item) => {
                    return item.token_id === payload.gain_token_id
                })
                // consume user assets update
                let newConBal: any = consumption_asset[0].balance - payload.consumption_amount;
                let conResponse = await assetModel.update({ balance: newConBal.toFixed(8) }, { where: { id: consumption_asset[0].id } });

                // gain user assets update
                if (gain_assets.length > 0) {
                    let newBal: any = gain_assets[0]?.balance + payload.gain_amount;
                    let gainResponse = await assetModel.update({ balance: newBal.toFixed(8) }, { where: { id: gain_assets[0].id } });
                }
                else {
                    let assets: assetsDto = {
                        walletTtype: assetsWalletType.main_wallet,
                        balance: payload.gain_amount,
                        account_type: assetsAccountType.main_account,
                        token_id: payload.gain_token_id,
                        user_id: payload.user_id
                    };
                    let addNewAssets = await assetModel.create(assets);
                }

                // ===========================================
                //admin_ assets update
                // ===========================================

                // consume user assets update
                let admin_newConBal: any = admin_consumption_asset[0].balance - payload.gain_amount;
                let admin_conResponse = await assetModel.update({ balance: admin_newConBal.toFixed(8) }, { where: { id: admin_consumption_asset[0].id } });

                // // gain user assets update
                if (admin_gain_assets.length > 0) {
                    let admin_newBal: any = admin_gain_assets[0]?.balance + payload.consumption_amount;
                    let admin_gainResponse = await assetModel.update({ balance: admin_newBal.toFixed(8) }, { where: { id: admin_gain_assets[0].id } });
                }
                else {
                    let assets: assetsDto = {
                        walletTtype: assetsWalletType.main_wallet,
                        balance: payload.consumption_amount,
                        account_type: assetsAccountType.main_account,
                        token_id: payload.consumption_token_id,
                        user_id: '3808e05f-7da6-441d-bf98-7b5ec864c694'
                    };
                    let addNewAssets = await assetModel.create(assets);
                }

            }
        }


        return convertResponse;
    }

    /**
     * 
     * @param payload convert history
     * @returns 
     */
    async createConvertHistory(payload: convertHistoryDto): Promise<convertHistoryOuput | any> {
        return await convertHistoryModel.create(payload);
    }

    async getRecord(user_id: string): Promise<convertOuput | any> {
        return await convertModel.findAll({ where: { user_id: user_id }, raw: true, order: [["createdAt", "DESC"]] });
    }

    async getHistoryRecord(user_id: string): Promise<convertOuput | any> {
        return await convertHistoryModel.findAll({
            where: { user_id: user_id },
            include: [{
                model: tokensModel
            }, {
                model: globalTokensModel
            }],
            order: [["createdAt", "DESC"]],
        });
    }

}

export default new convertDal();
