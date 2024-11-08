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
     * Fetch all trade pairs
     * @returns List of all trade pairs
     */
    async all(): Promise<any> {
        return await tradepairDal.all();
    }

     /**
     * Fetch trade pairs with pagination (offset and limit)
     * @param offset - The starting point for pagination
     * @param limit - The number of records to fetch
     * @returns Paginated list of trade pairs
     */
    async allByLimit(offset:any,limit:any): Promise<any> {
        return await tradepairDal.allByLimit(offset,limit);
    }

  /**
     * Check if a trade pair already exists
     * @param payload - Trade pair data to check
     * @returns The trade pair object if it exists, or an error if it does not
     */
    async alreadyExist(payload: tradePairDto): Promise<tradePairOuput | any> {
        return await tradepairDal.pairIfExist(payload)
    }

   /**
     * Create a new trade pair
     * @param payload - Data for the new trade pair
     * @returns The created trade pair object
     */
    async create(payload: tradePairDto): Promise<tradePairOuput> {
        return await tradepairDal.createPair(payload)
    }

   
    /**
     * Change the status of a trade pair (e.g., activate or deactivate)
     * @param payload - Contains trade pair ID and new status
     * @returns The result of the status update
     */

    async changeStatus(payload:updatePairStatus) : Promise<any>{
       return await tradepairDal.changeStatus(payload);
    }

     /**
     * Edit an existing trade pair
     * @param payload - Data to update the trade pair with
     * @returns The updated trade pair object
     */
    async edit(payload: tradePairDto): Promise<tradePairOuput> {
        return await tradepairDal.editPair(payload)
    }
}

export default tradePairServices;

