import service from "../../services/service";
import tokenListingDto from "../dto/token_listing.dto";
import tokenListingModel, { tokenListingOuput } from "../model/tokenListing.model";

class tokenListingDal {

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

    async getListOfToken():Promise<tokenListingOuput | any>{
        try {
            return await tokenListingModel.findAll();
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

}

export default new tokenListingDal();