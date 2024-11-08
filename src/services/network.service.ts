import networkDal from "../models/dal/network.dal";
import { networkInput, networkOuput } from "../models/model/network.model";


class networkServices {
  /**
   * Retrieves all published tokens.
   * 
   * This method fetches all the tokens that have been published. It calls the `all` method of the `networkDal` 
   * to retrieve the records from the database.
   * 
   * @returns {Promise<any>} A promise that resolves to a list of all published tokens.
   */
    async all () : Promise<any> {
        return await networkDal.all()
    }

 /**
   * Retrieves a network by its ID.
   * 
   * This method fetches a network based on the provided ID. It calls the `networkById` method of the `networkDal`
   * to fetch the record from the database.
   * 
   * @param {string} payload - The ID of the network to be retrieved.
   * @returns {Promise<any>} A promise that resolves to the network data for the specified ID.
   */
    async networkById (payload:string) : Promise<any> {
        return await networkDal.networkById(payload);
    }
   
   /**
   * Creates a new network.
   * 
   * This method creates a new network record based on the provided data. It calls the `createNetwork` method of the `networkDal` 
   * to insert the record into the database.
   * 
   * @param {networkInput} payload - The input data for the new network.
   * @returns {Promise<networkOuput>} A promise that resolves to the newly created network record.
   * @throws {Error} Throws an error if there is an issue creating the network.
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