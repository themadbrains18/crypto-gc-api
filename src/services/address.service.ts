import addressDal from "../models/dal/address.dal";
import networkDal from "../models/dal/network.dal";
import { addressInput, addressOuput } from "../models/model/address.model";
import { networkInput, networkOuput } from "../models/model/network.model";


class addressServices {

    /**
     * Retrieves all published addresses.
     * @returns - A list of all addresses.
     */
    async all () : Promise<any> {
        return await addressDal.all()
    }

    /**
     * Retrieves a specific address by ID with pagination.
     * @param payload - The address ID.
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @returns - The address with the given ID.
     */
    async addressById (payload:string,offset:string,limit:string) : Promise<any> {
        return await addressDal.addressyId(payload,offset,limit);
    }
   
    /**
     * Creates a new address.
     * @param payload - The address data.
     * @returns - The created address.
     */
    async create (payload : addressInput ) : Promise<addressOuput> {
        try {
           return await addressDal.createAddress(payload)
        } catch (error : any) {
            throw new Error(error.message)
        }
    }
    /**
     * Changes the status of an address.
     * @param payload - The address data with the updated status.
     * @returns - The result of the status change.
     */
    async changeStatus(payload:addressInput) : Promise<any>{
        return await addressDal.changeStatus(payload);
     }

         /**
     * Deletes an address by ID for a specific user.
     * @param addressId - The ID of the address to delete.
     * @param userId - The ID of the user who owns the address.
     * @returns - The result of the deletion operation.
     */
     async deleteAddress(address_id : string, user_id:string):Promise<addressOuput |any>{
        return await addressDal.deleteAddressByUserAddressId(address_id,user_id);
    }
}

export default addressServices