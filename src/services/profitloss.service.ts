import profitLossDto from "../models/dto/profitloss.dto";
import profitLossDal from "../models/dal/profitLoss.dal";
import { profitLossOuput } from "../models/model/takeprofit_stoploss.model";

class profitLossServices {

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: profitLossDto): Promise<profitLossOuput> {
        return await profitLossDal.createProfitLossPosition(payload)
    }

    async all(used_id : string) : Promise<profitLossOuput>{
        return await profitLossDal.all(used_id);
    }

    async close(position_id : string, used_id : string) : Promise<profitLossOuput>{
        return await profitLossDal.close(position_id, used_id);
    }

}

export default profitLossServices;

