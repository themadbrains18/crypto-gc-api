
import futureTradePairDal from "../models/dal/futurePair.dal";
import futureTradePairDto from "../models/dto/futurePair.dto";
import { tradePairOuput } from "../models/model/tradePair.model";
import { updateFuturePairStatus } from "../utils/interface";

class futureTradePairServices {

    /**
     * Retrieve all published trade pairs.
     * 
     * This method returns a list of all trade pairs that have been published.
     * The results are filtered based on the provided token name.
     * 
     * @param {string} name - The name of the token to filter the trade pairs.
     * @returns {Promise<any>} - A promise that resolves with the list of trade pairs for the provided token name.
     */
    async all(name: string): Promise<any> {
        return await futureTradePairDal.all(name);
    }

    /**
     * Retrieve trade pairs with pagination.
     * 
     * This method returns a limited number of trade pairs based on the offset and limit values provided. 
     * It supports pagination for displaying large lists of trade pairs.
     * 
     * @param {any} offset - The offset (starting point) for pagination.
     * @param {any} limit - The maximum number of trade pairs to return.
     * @returns {Promise<any>} - A promise that resolves with the trade pairs based on the offset and limit.
     */
    async allByLimit(offset: any, limit: any): Promise<any> {
        return await futureTradePairDal.allByLimit(offset, limit);
    }
    /**
     * Check if a trade pair already exists.
     * 
     * This method checks whether the provided trade pair already exists in the database by looking for 
     * a match for the given contract details.
     * 
     * @param {futureTradePairDto} payload - The trade pair details to check if it already exists.
     * @returns {Promise<tradePairOuput | any>} - A promise that resolves with the trade pair if it exists, or an appropriate result.
     */
    async alreadyExist(payload: futureTradePairDto): Promise<tradePairOuput | any> {
        return await futureTradePairDal.pairIfExist(payload)
    }

    /**
     * Create a new trade pair.
     * 
     * This method creates a new trade pair in the database based on the provided details in the payload.
     * 
     * @param {futureTradePairDto} payload - The trade pair details to create.
     * @returns {Promise<tradePairOuput>} - A promise that resolves with the created trade pair details.
     */
    async create(payload: futureTradePairDto): Promise<tradePairOuput> {
        return await futureTradePairDal.createPair(payload)
    }

    /**
     * Change the status of a trade pair.
     * 
     * This method allows an admin to change the status (active or inactive) of a trade pair. 
     * The status is updated in the database based on the provided payload.
     * 
     * @param {updateFuturePairStatus} payload - The status change request containing trade pair details and the new status.
     * @returns {Promise<any>} - A promise that resolves with the result of the status update operation.
     */
    async changeStatus(payload: updateFuturePairStatus): Promise<any> {
        return await futureTradePairDal.changeStatus(payload);
    }
    /**
     * Edit an existing trade pair.
     * 
     * This method allows editing the details of an existing trade pair. The provided payload contains
     * the updated details of the trade pair.
     * 
     * @param {futureTradePairDto} payload - The updated trade pair details to edit.
     * @returns {Promise<tradePairOuput>} - A promise that resolves with the updated trade pair details.
     */
    async edit(payload: futureTradePairDto): Promise<tradePairOuput> {
        return await futureTradePairDal.editPair(payload)
    }
}

export default futureTradePairServices;

