import { globalTokensModel } from "../models";
import tokenDal from "../models/dal/token.dal";
import tradepairDal from "../models/dal/tradepair.dal";
import tokenDto from "../models/dto/token.dto";
import tradePairDto from "../models/dto/tradePair.dto";
import { tokenInput, tokenOuput } from "../models/model/tokens.model";
import { tradePairOuput } from "../models/model/tradePair.model";
import { updatePairStatus, updateTokenStatus } from "../utils/interface";

class tradePairServices {

    /**
     * 
     * @returns return all published token 
     */
    async all(): Promise<any> {
        return await tradepairDal.all();
    }
    async allByLimit(offset:any,limit:any): Promise<any> {
        return await tradepairDal.allByLimit(offset,limit);
    }

    /**
     * 
     * @param payload if token contarct alread register
     * @returns 
     */
    async alreadyExist(payload: tradePairDto): Promise<tradePairOuput | any> {
        return await tradepairDal.pairIfExist(payload)
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: tradePairDto): Promise<tradePairOuput> {
        return await tradepairDal.createPair(payload)
    }

   
    /**
     * Active/Inactive token list by admin
     */

    async changeStatus(payload:updatePairStatus) : Promise<any>{
       return await tradepairDal.changeStatus(payload);
    }

    async edit(payload: tradePairDto): Promise<tradePairOuput> {
        return await tradepairDal.editPair(payload)
    }
}

export default tradePairServices;

