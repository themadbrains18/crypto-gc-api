
import futurePositionModel, { futurePositionOuput } from "../model/future_position.model";
import futurePositionDto from "../dto/futurePoistion.dto";
import profitLossDto from "../dto/profitloss.dto";
import takeProfitStopLossModel, { profitLossOuput } from "../model/takeprofit_stoploss.model";

class profitLossDal {


    /**
     * Create or update a profit and loss position.
     * 
     * If a position exists with the same `position_id` and is not closed, 
     * the existing record is updated with the new values (profit, loss, triggers).
     * Otherwise, a new position record is created.
     * 
     * @param payload - The profit and loss details to be created or updated.
     * 
     * @returns A Promise that resolves to the updated or created profit and loss position.
     * @throws Will throw an error if the creation or update fails.
     */
    async createProfitLossPosition(payload: profitLossDto): Promise<profitLossOuput | any> {
        try {
            let position = await takeProfitStopLossModel.findOne({ where: { position_id: payload?.position_id, isClose: false }, raw: true });
            if (position) {
                return await takeProfitStopLossModel.update({ profit_value: payload?.profit_value, loss_value: payload?.loss_value, trigger_profit: payload?.trigger_profit, trigger_loss: payload?.trigger_loss }, { where: { position_id: payload?.position_id, user_id: payload?.user_id } });
            }
            return await takeProfitStopLossModel.create(payload);
        } catch (error: any) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    /**
     * Retrieve all open (not closed) trades for a specific user.
     * 
     * @param userid - The user ID for which the trades are to be fetched.
     * 
     * @returns A Promise that resolves to a list of open trades with related future position details.
     * @throws Will throw an error if the retrieval fails.
     */
    async all(userid: string): Promise<any> {
        try {
            let trades = await takeProfitStopLossModel.findAll({
                where: { user_id: userid, isClose: false },
                include:{
                    model:futurePositionModel,
                    attributes:['leverage','leverage_type','direction']
                }
            });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Close a trade position by marking it as closed.
     * 
     * @param id - The position ID of the trade to be closed.
     * @param user_id - The user ID of the trade owner.
     * 
     * @returns A Promise that resolves to the updated position status.
     * @throws Will throw an error if the update fails.
     */
    async close(id: string, user_id: string): Promise<profitLossOuput | any> {
        try {
            return await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: id, user_id: user_id } });
        } catch (error) {
            console.log(error)
        }
    }


}

export default new profitLossDal();
