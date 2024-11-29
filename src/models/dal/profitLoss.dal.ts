
import futurePositionModel, { futurePositionOuput } from "../model/future_position.model";
import futurePositionDto from "../dto/futurePoistion.dto";
import profitLossDto from "../dto/profitloss.dto";
import takeProfitStopLossModel, { profitLossOuput } from "../model/takeprofit_stoploss.model";

class profitLossDal {

    /**
     * create new Position
     * @param payload
     * @returns
     */
    async createProfitLossPosition(payload: profitLossDto): Promise<profitLossOuput | any> {
        try {
          let futurePosition=  await futurePositionModel.findOne({where:{id:payload?.position_id}, raw:true})
            let position = await takeProfitStopLossModel.findOne({ where: { position_id: payload?.position_id, isClose: false }, raw: true });
            if (futurePosition && position) {
                return await takeProfitStopLossModel.update({ profit_value: payload?.profit_value, loss_value: payload?.loss_value, trigger_profit: payload?.trigger_profit, trigger_loss: payload?.trigger_loss }, { where: { position_id: payload?.position_id, user_id: payload?.user_id } });
            }
            return await takeProfitStopLossModel.create(payload);
        } catch (error: any) {
            console.log(error)
            throw new Error(error.message);
        }
    }

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

    async close(id: string, user_id: string): Promise<profitLossOuput | any> {
        try {
            return await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: id, user_id: user_id } });
        } catch (error) {
            console.log(error)
        }
    }


}

export default new profitLossDal();
