import tokenListingDal from "../models/dal/token_list.dal";
import tokenListingDto from "../models/dto/token_listing.dto";
import { tokenListingOuput } from "../models/model/tokenListing.model";

class tokenListingService{


    /**
     * Create a new token listing
     * @param payload - Token listing data to create
     * @returns The newly created token listing
     */
    async create(payload:tokenListingDto):Promise<tokenListingOuput|any>{
        return await tokenListingDal.create(payload);
    }

     /**
     * Check if a token already exists in the listing
     * @param name - The name of the token to check
     * @returns Boolean indicating whether the token exists or not
     */
    async ifTokenExist(name: string):Promise<boolean>{
        return tokenListingDal.checkTokenExist(name);
    }

     /**
     * Get a list of all token listings
     * @returns A list of all token listings
     */
    async getTokenList():Promise<tokenListingOuput | any>{
        return tokenListingDal.getListOfToken();
    }
}

export default tokenListingService;