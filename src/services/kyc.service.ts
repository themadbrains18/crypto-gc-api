import kycDal from "../models/dal/kyc.dal";
import kycDto from "../models/dto/kyc.dto";
import { kycInput, kycOuput } from "../models/model/kyc.model";

class kycServices{

   /**
     * Checks if a KYC record already exists for the given payload.
     * 
     * This method queries the KYC data access layer to verify whether the KYC
     * record already exists based on the provided details.
     * 
     * @param {kycDto} payload - The KYC data transfer object containing the details for checking existence.
     * @returns {Promise<kycOuput | any>} - A promise that resolves with the KYC output if the record exists or an error if it doesn't.
     */
    async alreadyExist (payload : kycDto ) : Promise<kycOuput | any> {
        return await kycDal.kycIfExist(payload)
    }

    /**
     * Creates a new KYC record.
     * 
     * This method calls the KYC data access layer to create a new KYC record
     * based on the provided payload. It is used to register a new KYC for a user.
     * 
     * @param {kycDto} payload - The KYC data transfer object containing the information to create a new KYC record.
     * @returns {Promise<kycOuput>} - A promise that resolves with the created KYC record.
     */
    async create (payload : kycDto ) : Promise<kycOuput> {
        return await kycDal.createKyc(payload)
    }

     /**
     * Edits an existing KYC record.
     * 
     * This method allows updating an existing KYC record by passing the updated
     * payload. The method updates the KYC details for the user.
     * 
     * @param {kycDto} payload - The KYC data transfer object containing the updated details.
     * @returns {Promise<kycOuput>} - A promise that resolves with the updated KYC record.
     */
    async edit (payload : kycDto ) : Promise<kycOuput> {
        return await kycDal.editKyc(payload)
    }

    /**
     * Updates the status of an existing KYC record.
     * 
     * This method updates the status of a KYC record based on the provided payload.
     * It is used to approve, reject, or update the KYC status for a specific user.
     * 
     * @param {kycDto} payload - The KYC data transfer object containing the updated status.
     * @returns {Promise<kycOuput>} - A promise that resolves with the updated KYC record status.
     */
    async updateStatus (payload : kycDto ) : Promise<kycOuput> {
        return await kycDal.updateKycStatus(payload)
    }

    /**
     * Retrieves a KYC record by user ID.
     * 
     * This method fetches a specific KYC record from the database by querying
     * using the user's ID. It returns the KYC details associated with the user.
     * 
     * @param {any} user_id - The ID of the user whose KYC record is being fetched.
     * @returns {Promise<kycOuput>} - A promise that resolves with the KYC record for the specified user.
     */
    async getKycById(user_id : any) : Promise<kycOuput>{
        return await kycDal.kycById(user_id);
    }

    /**
     * Retrieves all KYC records.
     * 
     * This method fetches all KYC records based on the specified type. It is typically
     * used to retrieve all KYC information for a particular category or status.
     * 
     * @param {any} type - The type or status filter used to retrieve the KYC records.
     * @returns {Promise<kycOuput>} - A promise that resolves with all the KYC records based on the given type.
     */
    async getAllKyc(type : any) : Promise<kycOuput>{
        return await kycDal.all(type);
    }

    /**
     * Retrieves KYC records with pagination.
     * 
     * This method fetches KYC records based on the provided type, offset, and limit
     * to enable paginated results. It is useful for listing KYC records in a paginated format.
     * 
     * @param {any} type - The type or status filter used to retrieve the KYC records.
     * @param {any} offset - The offset value for pagination.
     * @param {any} limit - The limit value to restrict the number of records fetched.
     * @returns {Promise<kycOuput>} - A promise that resolves with a paginated set of KYC records.
     */
    async getAllKycByLimit(type : any,offset:any,limit:any) : Promise<kycOuput>{
        return await kycDal.allByLimit(type,offset,limit);
    }
}

export default kycServices;