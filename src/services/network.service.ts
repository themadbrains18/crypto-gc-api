import networkDal from "../models/dal/network.dal";
import { networkInput, networkOuput } from "../models/model/network.model";


class networkServices {
    /**
     * 
     * @returns return all published token 
     */
    async all () : Promise<any> {
        return await networkDal.all()
    }


    async networkById (payload:string) : Promise<any> {
        return await networkDal.networkById(payload);
    }
   
    /**
     * 
     * @param payload 
     * @returns 
     */

    async create (payload : networkInput ) : Promise<networkOuput> {
        try {
           return await networkDal.createNetwork(payload)
        } catch (error : any) {
            throw new Error(error.message)
        }
    }
}

export default networkServices