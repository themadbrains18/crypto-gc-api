
import { Op } from "sequelize";
import { futurePositionModel } from "../models";
import futureOpenOrderDal from "../models/dal/futureOpenOrder.dal";
import futureOpenOrderDto from "../models/dto/futureOpenOrder.dto";
import futurePositionDto from "../models/dto/futurePoistion.dto";
import futureOpenOrderModel, { futureOpenOrderOuput } from "../models/model/future_open_order.model";
import service from "./service";
import MarketProfitModel, { MarketProfitInput } from "../models/model/marketProfit.model";

class futureOpenOrderServices {

    /**
     * 
     * @returns return all published token 
     */
    async all(userid: string): Promise<any> {
        return await futureOpenOrderDal.all(userid);
    }
    async allByLimit(offset: any, limit: any): Promise<any> {
        return await futureOpenOrderDal.allByLimit(offset, limit);
    }


    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: futureOpenOrderDto): Promise<any> {
        return await futureOpenOrderDal.createOpenOrder(payload)
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async edit(payload: futureOpenOrderDto): Promise<futureOpenOrderOuput> {
        return await futureOpenOrderDal.editOpenOrder(payload)
    }

    /**
     * Close Open Order by id
     * @param payload 
     * @param userId 
     * @returns 
     */
    async closeOpenOrderById(payload: string, userId: string): Promise<futureOpenOrderOuput | any> {
        return await futureOpenOrderDal.closeOpenOrderById(payload, userId);
    }

    async openOrderCron(): Promise<futureOpenOrderOuput | any> {
        try {

            // console.log('============cron limit order');
            let allTokens = await service.token.all();
            let openOrders = await futureOpenOrderModel.findAll({ where: { status: false, isDeleted: false, type: 'limit' }, raw: true });

            if (openOrders) {
                for await (const oo of openOrders) {

                    let token = allTokens.filter((t: any) => {
                        return t?.dataValues?.id === oo?.coin_id
                    })

                    let tt = token[0]?.dataValues;

                    if (Math.round(tt.price) === Math.round(oo.price_usdt)) {

                        let value: any = (oo.qty * 0.02).toFixed(5);
                        let releazedPnl: any = ((oo.price_usdt * value) / 100);

                        let body: futurePositionDto = {
                            symbol: oo.symbol,
                            coin_id: oo.coin_id,
                            user_id: oo.user_id,
                            entry_price: oo.price_usdt,
                            leverage: oo.leverage,
                            leverage_type: oo.leverage_type,
                            liq_price: oo.liq_price,
                            queue: false,
                            status: false,
                            size: parseFloat(oo.amount),
                            margin: oo.margin - releazedPnl,
                            market_price: oo.market_price,
                            tp_sl: '--',
                            market_type: 'limit',
                            order_type: oo.order_type,
                            pnl: 0.00,
                            realized_pnl: releazedPnl,
                            margin_ratio: 0.01,
                            direction: oo.side === 'open long' ? 'long' : 'short',
                            qty: oo.qty,
                            assets_margin: oo.margin - releazedPnl
                        }
                        let create = await futurePositionModel.create(body);
                        if (create) {
                            await futureOpenOrderModel.update({ status: true, isDeleted: false }, { where: { id: oo.id } });
                            // =========================================================//
                            // ================Fee Deduction from user and add to admin=================//
                            // =========================================================//
                            let futureProfit = 0;
                            try {
                                let profit: MarketProfitInput = {
                                    source_id: oo?.id,
                                    total_usdt: 0,
                                    paid_usdt: 0,
                                    admin_usdt: 0,
                                    buyer: oo?.user_id,
                                    seller: oo?.user_id,
                                    profit: futureProfit,
                                    fees: releazedPnl,
                                    coin_type: 'USDT',
                                    source_type: 'Future Trading',
                                }
                                await MarketProfitModel.create(profit);
                            } catch (error: any) {
                                throw new Error(error.message);
                            }
                        }
                    }
                    // if (oo.side === 'open long') {
                    //     if (tt.price > oo.price_usdt || tt.price === oo.price_usdt) {
                    //         let create = await futurePositionModel.create(body);
                    //         if (create) {
                    //             await futureOpenOrderModel.update({ status: true, isDeleted: false }, { where: { id: oo.id } });
                    //         }
                    //     }
                    // }
                    // if (oo.side === 'open short') {
                    //     if (tt.price < oo.price_usdt || tt.price === oo.price_usdt) {
                    //         let create = await futurePositionModel.create(body);
                    //         if (create) {
                    //             await futureOpenOrderModel.update({ status: true, isDeleted: true }, { where: { id: oo.id } });
                    //         }
                    //     }
                    // }
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async stopLimitOpenOrderCron(): Promise<futureOpenOrderOuput | any> {
        try {

            let allTokens = await service.token.all();
            let openOrders = await futureOpenOrderModel.findAll({ where: { status: false, isDeleted: false, isTrigger: false, type: { [Op.or]: ['buy', 'sell'] } }, raw: true });

            if (openOrders) {
                for await (const oo of openOrders) {

                    let token = allTokens.filter((t: any) => {
                        return t?.dataValues?.id === oo?.coin_id
                    })

                    let tt = token[0]?.dataValues;

                    if (Math.round(tt.price) === Math.round(parseFloat(oo.trigger))) {
                        await futureOpenOrderModel.update({ isTrigger: true, type: 'limit' }, { where: { id: oo.id } });
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async openOrderHistory(userId: string): Promise<futureOpenOrderOuput | any> {
        return await futureOpenOrderDal.openOrderHistory(userId);
    }

}

export default futureOpenOrderServices;

