import service from "../../services/service";
import tokenListingDto from "../dto/token_listing.dto";
import tokenListingModel, { tokenListingOuput } from "../model/tokenListing.model";

class tokenListingDal {

    /**
     * Creates a new token listing.
     * 
     * This method checks if the token already exists based on the symbol. If it doesn't 
     * exist, it creates a new token listing and persists it in the database.
     * 
     * @param {tokenListingDto} payload - The data transfer object containing details for creating a new token listing.
     * @returns {Promise<tokenListingOuput | any>} The newly created token listing or an error object if the creation fails.
     * @throws {Error} Throws an error if the token already exists or the creation fails.
     */
    async create(payload: tokenListingDto): Promise<tokenListingOuput | any> {
        try {
            let isExist = await service.token_list.ifTokenExist(payload.symbol);
            if (isExist == false) {
                return await tokenListingModel.create(payload);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Checks if a token with the given name already exists in the token listing.
     * 
     * This method queries the database to check if a token with the specified symbol 
     * already exists. If it does, an error is thrown; otherwise, it returns false.
     * 
     * @param {string} name - The symbol of the token to check.
     * @returns {Promise<boolean | any>} True if the token does not exist, false if it exists, or an error object if an issue occurs.
     * @throws {Error} Throws an error if the token already exists in the database.
     */
    async checkTokenExist(name: string): Promise<boolean | any> {
        try {
            let data = await tokenListingModel.findOne({where:{symbol : name}});
            let token = data?.dataValues;
            if(token){
                throw new Error('THis token is already exist.');
            }
            else {return false}
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
  /**
     * Retrieves a list of all token listings.
     * 
     * This method fetches all token listings from the database.
     * 
     * @returns {Promise<tokenListingOuput | any>} A list of all token listings or an error object if retrieval fails.
     * @throws {Error} Throws an error if the retrieval fails.
     */
    async getListOfToken():Promise<tokenListingOuput | any>{
        try {
            return await tokenListingModel.findAll();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

}

export default new tokenListingDal();