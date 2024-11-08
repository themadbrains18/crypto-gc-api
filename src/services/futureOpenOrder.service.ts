
import { Op } from "sequelize";
import { futurePositionModel } from "../models";
import futureOpenOrderDal from "../models/dal/futureOpenOrder.dal";
import futureOpenOrderDto from "../models/dto/futureOpenOrder.dto";
import futurePositionDto from "../models/dto/futurePoistion.dto";
import futureOpenOrderModel, { futureOpenOrderOuput } from "../models/model/future_open_order.model";
import service from "./service";
import MarketProfitModel, { MarketProfitInput } from "../models/model/marketProfit.model";
import futurePositionDal from "../models/dal/futurePosition.dal";

class futureOpenOrderServices {

    /**
       * Retrieve all open orders for a specific user.
       * 
       * This method retrieves all open orders associated with the provided user ID.
       * 
       * @param {string} userid - The ID of the user for whom open orders are to be fetched.
       * @returns {Promise<any>} - A promise that resolves with a list of open orders for the given user.
       */
    async all(userid: string): Promise<any> {
        return await futureOpenOrderDal.all(userid);
    }
    /**
 * Retrieve open orders with pagination.
 * 
 * This method retrieves a limited number of open orders based on the given offset and limit 
 * values for pagination purposes.
 * 
 * @param {any} offset - The offset (starting point) for pagination.
 * @param {any} limit - The maximum number of open orders to return.
 * @returns {Promise<any>} - A promise that resolves with the list of open orders based on the provided offset and limit.
 */
    async allByLimit(offset: any, limit: any): Promise<any> {
        return await futureOpenOrderDal.allByLimit(offset, limit);
    }


    /**
     * Create a new open order.
     * 
     * This method creates a new open order based on the provided details in the payload.
     * 
     * @param {futureOpenOrderDto} payload - The details of the open order to be created.
     * @returns {Promise<any>} - A promise that resolves with the details of the newly created open order.
     */
    async create(payload: futureOpenOrderDto): Promise<any> {

        // console.log(payload,'=========TP/SL request====');

        // return

        return await futureOpenOrderDal.createOpenOrder(payload)
    }

    /**
     * Edit an existing open order.
     * 
     * This method allows editing the details of an existing open order by updating its information 
     * with the provided payload.
     * 
     * @param {futureOpenOrderDto} payload - The updated open order details to apply.
     * @returns {Promise<futureOpenOrderOuput>} - A promise that resolves with the updated open order details.
     */
    async edit(payload: futureOpenOrderDto): Promise<futureOpenOrderOuput> {
        return await futureOpenOrderDal.editOpenOrder(payload)
    }

    /**
     * Close a specific open order by its ID.
     * 
     * This method closes the open order identified by the provided ID and user ID, marking it as completed.
     * 
     * @param {string} payload - The ID of the open order to close.
     * @param {string} userId - The ID of the user who owns the open order.
     * @returns {Promise<futureOpenOrderOuput | any>} - A promise that resolves with the result of the close operation.
     */
    async closeOpenOrderById(payload: string, userId: string): Promise<futureOpenOrderOuput | any> {
        return await futureOpenOrderDal.closeOpenOrderById(payload, userId);
    }

    /**
     * Close all open orders for a specific user.
     * 
     * This method closes all open orders associated with the given user ID.
     * 
     * @param {string} userId - The ID of the user whose open orders are to be closed.
     * @returns {Promise<futureOpenOrderOuput | any>} - A promise that resolves with the result of closing all open orders for the user.
     */
    async closeOpenOrders(userId: string): Promise<futureOpenOrderOuput | any> {
        return await futureOpenOrderDal.closeOpenOrder(userId);
    }

    /**
     * Cron job that processes open orders and creates positions based on certain conditions.
     * 
     * This method fetches all tokens and open orders, processes them based on the price conditions, 
     * and creates positions for 'long' or 'short' orders. It also updates the open order status, 
     * calculates realized PnL (Profit and Loss), and records the transaction details including fees.
     * 
     * Additionally, it handles the deduction of fees from the user and adds them to the admin account.
     * 
     * The method performs the following steps:
     * - Fetches all tokens and open orders.
     * - For each open order, it checks if it meets the conditions for creating a position.
     * - Creates the position and calculates the realized PnL.
     * - Updates the open order status and logs the transaction.
     * - Deductions and profit record are handled.
     * 
     * @returns {Promise<futureOpenOrderOuput | any>} - A promise that resolves when all open orders have been processed.
     * @throws {Error} - Throws an error if any issue occurs while processing the open orders or creating positions.
     */
    async openOrderCron(): Promise<futureOpenOrderOuput | any> {
        try {
            let allTokens = await service.token.all();
            let openOrders = await futureOpenOrderModel.findAll({ where: { status: false, isDeleted: false, type: 'limit', queue: false }, raw: true });

            if (openOrders) {
                for await (const oo of openOrders) {
                    await futureOpenOrderModel.update({ queue: true }, { where: { id: oo.id } });

                    let token = allTokens.filter((t: any) => {
                        return t?.dataValues?.id === oo?.coin_id
                    })

                    let tt = token[0]?.dataValues;

                    if (Math.round(tt.price) <= Math.round(oo.price_usdt) && oo.side === 'open long') {

                        let value: any = (oo.qty * 0.02).toFixed(5);
                        let releazedPnl: any = ((oo.price_usdt * value) / 100);
                        console.log(oo, "===oo");
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
                            margin: oo.margin,
                            market_price: oo.market_price,
                            tp_sl: '--',
                            market_type: 'limit',
                            order_type: oo.order_type,
                            pnl: 0.00,
                            realized_pnl: releazedPnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0],
                            margin_ratio: 0.01,
                            direction: 'long',
                            qty: oo.qty,
                            assets_margin: oo.margin - releazedPnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0],
                            position_mode: oo.position_mode
                        }
                        console.log("in create position");

                        let create = await futurePositionDal.createPosition(body)
                        // futurePositionModel.create(body);
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

                    if (Math.round(tt.price) >= Math.round(oo.price_usdt) && oo.side === 'open short') {

                        let value: any = (oo.qty * 0.02).toFixed(5);
                        let releazedPnl: any = ((oo.price_usdt * value) / 100);
                        console.log(oo, "===oo");


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
                            margin: oo.margin,
                            // margin: parseFloat(oo.amount) - releazedPnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0],
                            market_price: oo.market_price,
                            tp_sl: '--',
                            market_type: 'limit',
                            order_type: oo.order_type,
                            pnl: 0.00,
                            realized_pnl: releazedPnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0],
                            margin_ratio: 0.01,
                            direction: 'short',
                            qty: oo.qty,
                            assets_margin: oo.margin - releazedPnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0],
                            position_mode: oo.position_mode
                        }
                        let create = await futurePositionDal.createPosition(body);
                        // futurePositionModel.create(body);
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

                    await futureOpenOrderModel.update({ queue: false }, { where: { id: oo.id } });
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    /**
     * Cron job that processes stop-limit open orders.
     * 
     * This method checks all the open orders with status `false` and `isTrigger` set to `false`. 
     * It verifies if the current market price matches the trigger price for each order. 
     * When the price condition is met, it updates the open order's status to `isTrigger: true` and changes its type to 'limit'.
     * 
     * The method performs the following steps:
     * - Fetches all tokens and open orders that are not triggered and not deleted.
     * - For each open order, it checks if the current market price equals the trigger price.
     * - If the price condition is met, it updates the open order's status and type.
     * 
     * @returns {Promise<futureOpenOrderOuput | any>} - A promise that resolves after processing the open orders.
     * @throws {Error} - Throws an error if any issue occurs while processing the open orders.
     */
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

    /**
     * Retrieves the open order history for a user.
     * 
     * This method fetches all open orders associated with a user from the database.
     * 
     * @param {string} userId - The user ID for whom the open order history needs to be fetched.
     * @returns {Promise<futureOpenOrderOuput | any>} - A promise that resolves to the open order history of the user.
     */
    async openOrderHistory(userId: string): Promise<futureOpenOrderOuput | any> {
        return await futureOpenOrderDal.openOrderHistory(userId);
    }

}

export default futureOpenOrderServices;

