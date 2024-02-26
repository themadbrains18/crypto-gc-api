import tokenListingDal from "../models/dal/token_list.dal";
import tokenListingDto from "../models/dto/token_listing.dto";
import { tokenListingOuput } from "../models/model/tokenListing.model";

class tokenListingService{

    async create(payload:tokenListingDto):Promise<tokenListingOuput|any>{
        return await tokenListingDal.create(payload);
    }

    async ifTokenExist(name: string):Promise<boolean>{
        return tokenListingDal.checkTokenExist(name);
    }

    async getTokenList():Promise<tokenListingOuput | any>{
        return tokenListingDal.getListOfToken();
    }
}

export default tokenListingService;