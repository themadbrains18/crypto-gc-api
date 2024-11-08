
import sequelize, { takeProfitStopLossModel } from "../models";
import futurePositionDal from "../models/dal/futurePosition.dal";
import futurePositionDto from "../models/dto/futurePoistion.dto";
import futurePositionModel, { futurePositionOuput } from "../models/model/future_position.model";
import { preciseSubtraction } from "../utils/utility";
import { scientificToDecimal } from "./market.service";
import service from "./service";

class futurePositionServices {

    /**
     * Retrieves all published tokens associated with the specified user.
     * 
     * This method calls the `futurePositionDal.all` method to fetch all published tokens.
     * It requires a `userid` to filter the records based on the user.
     * 
     * @param {string} userid - The ID of the user for filtering the tokens.
     * @returns {Promise<any>} - A promise that resolves to the list of all published tokens for the user.
     */
    async all(userid: string): Promise<any> {
        return await futurePositionDal.all(userid);
    }

    /**
     * Retrieves position orders with pagination support (using offset and limit).
     * 
     * This method calls the `futurePositionDal.allByLimit` method to fetch position orders 
     * with the provided offset and limit for pagination. It is useful for displaying large 
     * amounts of position orders in a paginated way.
     * 
     * @param {any} offset - The offset for pagination (which record to start from).
     * @param {any} limit - The limit on the number of records to fetch per page.
     * @returns {Promise<any>} - A promise that resolves to a paginated list of position orders.
     */
    async allByLimit(offset: any, limit: any): Promise<any> {
        return await futurePositionDal.allByLimit(offset, limit);
    }

    /**
     * Creates a new future position order.
     * 
     * This method calls the `futurePositionDal.createPosition` to create a new position based on the 
     * provided `payload`. It expects the position details to be passed as a `futurePositionDto` object.
     * 
     * @param {futurePositionDto} payload - The details of the future position to be created.
     * @returns {Promise<futurePositionOuput>} - A promise that resolves to the created future position output.
     */
    async create(payload: futurePositionDto): Promise<futurePositionOuput> {
        return await futurePositionDal.createPosition(payload)
    }

    /**
     * Edits an existing future position order.
     * 
     * This method calls the `futurePositionDal.editPosition` to edit an existing future position. 
     * It expects the updated position details to be passed as a `futurePositionDto` object.
     * 
     * @param {futurePositionDto} payload - The updated details of the future position.
     * @returns {Promise<futurePositionOuput>} - A promise that resolves to the edited future position output.
     */
    async edit(payload: futurePositionDto): Promise<futurePositionOuput> {
        return await futurePositionDal.editPosition(payload)
    }

    /**
     * Cron position trading order and execute on price update.
     * 
     * This method is responsible for checking all the positions (both long and short) and 
     * performing various actions based on the current market price and the position’s conditions.
     * It will update the positions when a specific profit or loss trigger is hit, or when the 
     * market price goes below/above liquidation price. It also ensures to close positions when 
     * certain conditions are met and updates the database accordingly.
     * 
     * The method processes each position one by one, checking for the following conditions:
     * - Whether the position has reached its profit or loss trigger
     * - Whether the position's PnL (Profit and Loss) has reached a level where the user’s margin 
     *   is insufficient and needs to be closed
     * - Whether the price has hit the liquidation price, in which case the position is closed
     * 
     * @returns {Promise<any>} - A promise that resolves after all positions are processed or closed based on the conditions.
     */
    async positionCron(): Promise<any> {
        try {
            let allTokens = await service.token.all();
            let positions = await futurePositionModel.findAll({ where: { status: false, queue: false }, raw: true });

            if (positions) {
                for await (let ps of positions) {
                    let profitLoss = await takeProfitStopLossModel.findOne({ where: { position_id: ps?.id }, raw: true });
                    await futurePositionModel.update({ queue: true }, { where: { id: ps?.id } });
                    let token = allTokens.filter((t: any) => {
                        return t?.dataValues?.id === ps?.coin_id
                    })
                    let tt = token[0]?.dataValues;

                    if (ps?.direction === 'long' && Boolean(profitLoss?.isClose) == false) {
                        if (profitLoss) {
                            if (profitLoss?.trigger_profit > 0 && tt?.price >= profitLoss?.trigger_profit) {
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.profit_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: ps?.id } });
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                            if (profitLoss?.trigger_loss > 0 && tt?.price <= profitLoss?.trigger_loss) {
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.loss_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: ps?.id } });
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                        }
                        //=========== USDT PnL ================
                        let usdt_pnl: any = scientificToDecimal(ps.qty * preciseSubtraction(tt?.price, ps?.entry_price, 10));
                        console.log(usdt_pnl, "==usdt pnl");

                        // check if loss equal to position margin(user USDT assets) or less than margin than close position 
                        if (usdt_pnl < 0) {
                            let remainingMargin = ps.margin + usdt_pnl;
                            if (remainingMargin <= 0) {
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: usdt_pnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0] }, { where: { id: ps?.id } });
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                        }

                        if (tt.price <= ps.liq_price) {
                            await futurePositionModel.update({ status: true, isDeleted: true, pnl: usdt_pnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0] }, { where: { id: ps?.id } });
                            futurePositionDal.closePosition(ps?.id, ps?.user_id);
                            return;
                        }

                        await futurePositionModel.update({ pnl: usdt_pnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0], queue: false }, { where: { id: ps?.id } });
                    }

                    else if (ps?.direction === 'short') {
                        // console.log(profitLoss,'===========profitLoss');
                        // console.log(tt,'============tt');

                        if (profitLoss) {
                            if (profitLoss?.trigger_profit > 0 && tt?.price <= profitLoss?.trigger_profit) {
                                console.log('=======here 1');

                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.profit_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: ps?.id } });
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                            if (profitLoss?.trigger_loss > 0 && tt?.price >= profitLoss?.trigger_loss) {
                                console.log('=======here 2');
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.loss_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: ps?.id } });
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                        }
                        //=========== USDT PnL ================
                        let usdt_pnl: any = scientificToDecimal(ps.qty * preciseSubtraction(ps?.entry_price, tt?.price, 10));
                        console.log(usdt_pnl, '============usdt_pnl2');
                        // console.log(ps,'========position');

                        if (usdt_pnl < 0) {
                            let remainingMargin = ps.margin + usdt_pnl;
                            if (remainingMargin < 0 || remainingMargin === 0) {
                                console.log('=======here 3');
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: usdt_pnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0] }, { where: { id: ps?.id } });
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                        }
                        if (tt.price >= ps.liq_price) {
                            console.log('=======here 4');
                            await futurePositionModel.update({ status: true, isDeleted: true, pnl: usdt_pnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0] }, { where: { id: ps?.id } });
                            futurePositionDal.closePosition(ps?.id, ps?.user_id);
                            return;
                        }
                        await futurePositionModel.update({ pnl: usdt_pnl.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0], queue: false }, { where: { id: ps?.id } });
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error);
        }
    }

    /**
     * Close position by user and position id.
     * 
     * This method allows a user to close a specific position by providing the position ID
     * and the user ID. It interacts with the database layer to update the position's status 
     * to closed and performs any necessary cleanup.
     * 
     * @param {string} payload - The position ID that needs to be closed.
     * @param {string} userId - The user ID for the position to be closed.
     * @returns {Promise<futurePositionOuput | any>} - A promise that resolves with the updated position details 
     * or any other relevant information based on the database operation.
     */
    async closePositionById(payload: string, userId: string): Promise<futurePositionOuput | any> {
        return await futurePositionDal.closePosition(payload, userId);
    }

    /**
     * Close all positions by user ID.
     * 
     * This method allows a user to close all of their positions by providing the user ID.
     * It interacts with the database to update the status of all positions belonging 
     * to the user to "closed" and ensures all relevant data is cleaned up.
     * 
     * @param {string} userId - The user ID whose positions need to be closed.
     * @returns {Promise<futurePositionOuput | any>} - A promise that resolves with the result of closing all positions
     * for the specified user.
     */
    async closeAllPositionByUser(userId: string): Promise<futurePositionOuput | any> {
        return await futurePositionDal.closeAllPosition(userId);
    }
    /**
     * Retrieve position history for a user.
     * 
     * This method fetches the position history for a given user based on their user ID. 
     * It returns details about the user's past positions including status, profits, losses, 
     * and other relevant information.
     * 
     * @param {string} userId - The user ID for which position history needs to be fetched.
     * @returns {Promise<futurePositionOuput | any>} - A promise that resolves with the user's position history.
     */
    async positionHistory(userId: string): Promise<futurePositionOuput | any> {
        return await futurePositionDal.positionHistory(userId);
    }
    /**
     * Get the last market data for a coin.
     * 
     * This method retrieves the most recent market data for a given coin by its coin ID.
     * It provides details such as the highest and lowest entry price, total margin volume,
     * and the opening and closing prices for that coin. If no data is found, default values are returned.
     * 
     * @param {string} coinid - The ID of the coin for which market data is being retrieved.
     * @returns {Promise<any>} - A promise that resolves with the market data for the coin or default values if no data is found.
     * @throws {Error} - Throws an error if the database query fails or if any other issues occur during execution.
     */
    async coinLastData(coinid: string): Promise<any> {
        try {

            if (coinid === undefined) return

            let data = await sequelize.query(`SELECT DATE(current_date()) AS time, max(entry_price) AS high, min(entry_price) AS low,SUM(margin) as volume,
          CAST(SUBSTRING_INDEX(MIN(CONCAT(createdAt, '_', entry_price)), '_', -1) as double)  as open,
            CAST( SUBSTRING_INDEX(MAX(CONCAT(createdAt, '_', entry_price)), '_', -1)as double) AS close
          FROM exchanage.futurepositions AS marketorder where  coin_id='${coinid}' GROUP BY time`);

            if (data[0].length > 0) {
                return data[0][0];
            }
            else {
                return {
                    time: new Date(),
                    high: 0.00,
                    low: 0.00,
                    open: 0.00,
                    close: 0.00,
                    volume: 0.00
                };
            }

        } catch (error: any) {
            console.log(error)
            throw new Error(error.message)
        }
    }

    /**
     * Retrieve the order book for a specific coin.
     * 
     * This method fetches the current order book for a given coin by its coin ID. 
     * It provides a snapshot of the market's buy and sell orders, helping users 
     * understand the supply and demand for the coin in the market.
     * 
     * @param {string} coinid - The ID of the coin for which the order book is being fetched.
     * @returns {Promise<any>} - A promise that resolves with the order book data for the specified coin.
     */
    async orderbook(coinid: string): Promise<any> {
        return await futurePositionDal.orderbook(coinid);
    }
}

export default futurePositionServices;

