
import sequelize, { takeProfitStopLossModel } from "../models";
import futurePositionDal from "../models/dal/futurePosition.dal";
import futurePositionDto from "../models/dto/futurePoistion.dto";
import futurePositionModel, { futurePositionOuput } from "../models/model/future_position.model";
import { preciseSubtraction } from "../utils/utility";
import { scientificToDecimal } from "./market.service";
import service from "./service";

class futurePositionServices {

    /**
     * 
     * @returns return all published token 
     */
    async all(userid: string): Promise<any> {
        return await futurePositionDal.all(userid);
    }

    /**
     * Get position order by limit and offset for pagination
     * @param offset 
     * @param limit 
     * @returns 
     */
    async allByLimit(offset: any, limit: any): Promise<any> {
        return await futurePositionDal.allByLimit(offset, limit);
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: futurePositionDto): Promise<futurePositionOuput> {
        return await futurePositionDal.createPosition(payload)
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async edit(payload: futurePositionDto): Promise<futurePositionOuput> {
        return await futurePositionDal.editPosition(payload)
    }

    /**
     * Cron position trading order and execute on price update
     * @returns 
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
                    if (ps?.direction === 'long') {

                        if (profitLoss) {
                            if (profitLoss?.trigger_profit > 0 && tt?.price >= profitLoss?.trigger_profit) {
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.profit_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({isClose : true},{where : {position_id : ps?.id}});
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                            if (profitLoss?.trigger_loss > 0 && tt?.price <= profitLoss?.trigger_loss ) {
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.loss_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({isClose : true},{where : {position_id : ps?.id}});
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                        }
                        //=========== USDT PnL ================
                        let usdt_pnl: any = scientificToDecimal(ps.qty * preciseSubtraction(tt?.price , ps?.entry_price,10));
                        console.log(usdt_pnl,"==usdt pnl");
                        
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
                            if (profitLoss?.trigger_profit > 0 && tt?.price <= profitLoss?.trigger_profit ) {
                                console.log('=======here 1');
                                
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.profit_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({isClose : true},{where : {position_id : ps?.id}});
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                            if (profitLoss?.trigger_loss > 0 && tt?.price >= profitLoss?.trigger_loss) {
                                console.log('=======here 2');
                                await futurePositionModel.update({ status: true, isDeleted: true, pnl: profitLoss?.loss_value }, { where: { id: ps?.id } });
                                await takeProfitStopLossModel.update({isClose : true},{where : {position_id : ps?.id}});
                                futurePositionDal.closePosition(ps?.id, ps?.user_id);
                                return;
                            }
                        }
                        //=========== USDT PnL ================
                        let usdt_pnl: any = scientificToDecimal(ps.qty * preciseSubtraction(ps?.entry_price , tt?.price,10));
                        console.log(usdt_pnl,'============usdt_pnl2');
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
     * Close position by user and position id
     * @param payload 
     * @param userId 
     * @returns 
     */
    async closePositionById(payload: string, userId: string): Promise<futurePositionOuput | any> {
        return await futurePositionDal.closePosition(payload, userId);
    }

    /**
     * Close all position by user id
     * @param userId 
     * @returns 
     */
    async closeAllPositionByUser(userId: string): Promise<futurePositionOuput | any> {
        return await futurePositionDal.closeAllPosition(userId);
    }

    async positionHistory(userId: string): Promise<futurePositionOuput | any> {
        return await futurePositionDal.positionHistory(userId);
    }

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

    // trades order book

    async orderbook(coinid: string): Promise<any> {
        return await futurePositionDal.orderbook(coinid);
    }
}

export default futurePositionServices;

