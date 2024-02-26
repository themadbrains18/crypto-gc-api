import kycDal from "../models/dal/kyc.dal";
import kycDto from "../models/dto/kyc.dto";
import { kycInput, kycOuput } from "../models/model/kyc.model";

class kycServices{

    /**
     * 
     * @param payload if token contarct alread register
     * @returns 
     */
    async alreadyExist (payload : kycDto ) : Promise<kycOuput | any> {
        return await kycDal.kycIfExist(payload)
    }

    /**
     * 
     * @param payload 
     * @returns 
     */

    async create (payload : kycDto ) : Promise<kycOuput> {
        return await kycDal.createKyc(payload)
    }

    async edit (payload : kycDto ) : Promise<kycOuput> {
        return await kycDal.editKyc(payload)
    }

    /**
     * update kyc status
     * @param payload
     * @returns 
     */
    async updateStatus (payload : kycDto ) : Promise<kycOuput> {
        return await kycDal.updateKycStatus(payload)
    }

    /**
     * get kyc by user id
     * @param user_id 
     * @returns 
     */
    async getKycById(user_id : any) : Promise<kycOuput>{
        return await kycDal.kycById(user_id);
    }

    /**
     * get all kyc records
     * @param type 
     * @returns 
     */
    async getAllKyc(type : any) : Promise<kycOuput>{
        return await kycDal.all(type);
    }
    async getAllKycByLimit(type : any,offset:any,limit:any) : Promise<kycOuput>{
        return await kycDal.allByLimit(type,offset,limit);
    }
}

export default kycServices;