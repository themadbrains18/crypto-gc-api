
import futureTradePairDal from "../models/dal/futurePair.dal";
import futureTradePairDto from "../models/dto/futurePair.dto";
import { tradePairOuput } from "../models/model/tradePair.model";
import { updateFuturePairStatus } from "../utils/interface";

class futureTradePairServices {

    /**
     * 
     * @returns return all published token 
     */
    async all(name:string): Promise<any> {
        return await futureTradePairDal.all(name);
    }

    async allByLimit(offset: any, limit: any): Promise<any> {
        return await futureTradePairDal.allByLimit(offset, limit);
    }

    /**
     * 
     * @param payload if token contarct alread register
     * @returns 
     */
    async alreadyExist(payload: futureTradePairDto): Promise<tradePairOuput | any> {
        return await futureTradePairDal.pairIfExist(payload)
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: futureTradePairDto): Promise<tradePairOuput> {
        return await futureTradePairDal.createPair(payload)
    }


    /**
     * Active/Inactive token list by admin
     */

    async changeStatus(payload: updateFuturePairStatus): Promise<any> {
        return await futureTradePairDal.changeStatus(payload);
    }

    async edit(payload: futureTradePairDto): Promise<tradePairOuput> {
        return await futureTradePairDal.editPair(payload)
    }
}

export default futureTradePairServices;

