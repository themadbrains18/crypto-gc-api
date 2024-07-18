import * as express from 'express'
import futureOpenOrderModel, { futureOpenOrderOuput } from "../model/future_open_order.model";
import futureOpenOrderDto from "../dto/futureOpenOrder.dto";
import globalTokensModel from "../model/global_token.model";
import tokensModel from "../model/tokens.model";
import assetModel from "../model/assets.model";
import BaseController from "../../controllers/main.controller";

class futureOpenOrderDal extends BaseController {

    /**
     * return all tokens data
     * @returns
     */
    async all(userid: string): Promise<any> {
        try {

            let trades = await futureOpenOrderModel.findAll({ where: { user_id: userid, status: false, isDeleted: false } });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async allByLimit(offset: any, limit: any): Promise<any> {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let trades = await futureOpenOrderModel.findAll({ where: { isDeleted: false }, limit: limits, offset: offsets });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * create new token
     * @param payload
     * @returns
     */

    async createOpenOrder(payload: futureOpenOrderDto): Promise<any> {
        try {
            //================================================
            //=================== Get Token =================
            //================================================
            let global_token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });

            if (payload?.order_type !== 'value') {
                global_token = await globalTokensModel.findOne({ where: { id: payload?.coin_id }, raw: true });
                if (global_token === null) {
                    global_token = await tokensModel.findOne({ where: { id: payload?.coin_id }, raw: true });
                }
            }

            if (global_token) {
                let asset: any = await assetModel.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });

                let margin_price: any = payload?.margin;

                if (asset?.balance > 0 && (asset.balance > margin_price)) {

                    //================================================
                    //===============Create Position =================
                    //================================================
                    let res = await futureOpenOrderModel.create(payload);
                    if (res) {

                        //================================================
                        //================ Update Assets =================
                        //================================================
                        let newbal: any = asset?.balance - margin_price;
                        await assetModel.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });
                    }
                    return res;
                }
                else {
                    // super.fail(express.response,'Insufficiant Balance')
                    // // throw new Error('Insufficiant Balance');

                    return { "error": "Insufficiant Balance" }
                }
            }
        } catch (error: any) {
            console.log(error)
            throw new Error(error?.message);
        }
    }

    async editOpenOrder(payload: futureOpenOrderDto): Promise<futureOpenOrderOuput | any> {
        try {

            return await futureOpenOrderModel.update(payload, { where: { id: payload.id } });

        } catch (error) {
            console.log(error)
        }
    }

    async closeOpenOrderById(payload: string, userId: string): Promise<futureOpenOrderOuput | any> {
        try {
            let order = await futureOpenOrderModel.findOne({ where: { id: payload, isDeleted: false }, raw: true });
            if (order) {
                let global_token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                if (global_token) {
                    let asset: any = await assetModel.findOne({ where: { user_id: userId, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
                    if (asset) {
                        let newBal = asset?.balance + order?.margin;
                        let updateAsset = await assetModel.update({ balance: newBal }, { where: { id: asset?.id } });
                        await futureOpenOrderModel.update({ isDeleted: true }, { where: { id: payload } });
                        // order.isDeleted = true;
                        return order;
                    }
                }
            }
            else {
                return { "data": null, "message": 'This order record not found.' }
            }
        } catch (error: any) {
            // console.log(error, '=========here');
            return { error: error.message }
        }
    }

    /**
     * Get user open order history
     * @param userid 
     * @returns 
     */
    async openOrderHistory(userid: string): Promise<any> {
        try {
            let trades = await futureOpenOrderModel.findAll({
                where: { user_id: userid },
            });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default new futureOpenOrderDal();
