import addressDal from "../models/dal/address.dal";
import networkDal from "../models/dal/network.dal";
import { addressInput, addressOuput } from "../models/model/address.model";
import { networkInput, networkOuput } from "../models/model/network.model";


class addressServices {
    /**
     * 
     * @returns return all published token 
     */
    async all () : Promise<any> {
        return await addressDal.all()
    }


    async addressById (payload:string,offset:string,limit:string) : Promise<any> {
        return await addressDal.addressyId(payload,offset,limit);
    }
   
    /**
     * 
     * @param payload 
     * @returns 
     */

    async create (payload : addressInput ) : Promise<addressOuput> {
        try {
           return await addressDal.createAddress(payload)
        } catch (error : any) {
            throw new Error(error.message)
        }
    }

    
    async changeStatus(payload:addressInput) : Promise<any>{
        return await addressDal.changeStatus(payload);
     }

     async deleteAddress(address_id : string, user_id:string):Promise<addressOuput |any>{
        return await addressDal.deleteAddressByUserAddressId(address_id,user_id);
    }
}

export default addressServices