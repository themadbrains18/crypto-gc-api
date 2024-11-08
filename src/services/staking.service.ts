import stakingDal from "../models/dal/staking.dal";
import {stakingDto, tokenStakeDto} from "../models/dto/staking.dto";
import stakingModel, { stakingOuput } from "../models/model/staking.model";
import { tokenstakeInput } from "../models/model/tokenstake.model";

class stakingService{

    /**
     * Creates a new staking record.
     * 
     * @param {stakingDto} payload The data to create a new staking record.
     * @returns {Promise<stakingOuput | any>} A promise that resolves to the created staking record or an error.
     */
    async create(payload : stakingDto) : Promise<stakingOuput | any>{
        return await stakingDal.createStaking(payload);
    }

      /**
     * Retrieves all staking records for a specific user.
     * 
     * @param {string} user_id The ID of the user whose staking records are to be retrieved.
     * @returns {Promise<stakingOuput | any>} A promise that resolves to the user's staking records or an error.
     */
    async getAllStaking(user_id:string):Promise<stakingOuput | any>{
        return await stakingDal.getAllStaking(user_id);
    }
     /**
     * Retrieves staking records for a specific user with pagination (offset and limit).
     * 
     * @param {string} user_id The ID of the user whose staking records are to be retrieved.
     * @param {string} offset The offset (starting point) for retrieving records.
     * @param {string} limit The maximum number of records to retrieve.
     * @returns {Promise<stakingOuput | any>} A promise that resolves to a paginated list of the user's staking records.
     */
    async getAllStakingByLimit(user_id:string,offset:string,limit:string):Promise<stakingOuput | any>{
        return await stakingDal.getAllStakingByLimit(user_id,offset,limit);
    }

     /**
     * Retrieves staking data for a specific token and user.
     * 
     * @param {string} token_id The ID of the token to retrieve staking data for.
     * @param {string} user_id The ID of the user whose staking data is to be retrieved.
     * @returns {Promise<stakingOuput | any>} A promise that resolves to the staking data for the specified token and user.
     */
    async getStakingByToken(token_id : string, user_id: string):Promise<stakingOuput | any>{
        return await stakingDal.getStakingDataByTokenId(token_id, user_id);
    }

    /**
     * Compares two dates and determines if the first date is earlier than the second.
     * 
     * @param {Date} d1 The first date to compare.
     * @param {Date} d2 The second date to compare.
     * @returns {boolean} Returns true if the first date is earlier than or equal to the second date, otherwise false.
     */
    async compareDates(d1:Date, d2:Date){
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime();
      
        if (date1 < date2) {
          return true;
        } else if (date1 > date2) {
          return false;
        } else {
          return true;
        }
    };

    /**
     * Executes a cron job for staking activities.
     * 
     * This function triggers the cron function to handle staking tasks such as rewarding or updating staking data.
     * 
     * @returns {Promise<void>} A promise that resolves once the cron job has completed.
     */
    async stakingCron(){
        stakingDal.cronStaking();
    }

     /**
     * Releases a staking record based on a given identifier.
     * 
     * @param {string} payload The identifier (ID) for the staking record to release.
     * @returns {Promise<stakingOuput | any>} A promise that resolves to the released staking record or an error.
     */
    async releaseStaking(payload: string): Promise<stakingOuput | any> {
        return await stakingDal.releaseStaking(payload);
    }

     /**
     * Creates an admin-level staking record.
     * 
     * @param {tokenStakeDto} payload The data to create an admin-level staking record.
     * @returns {Promise<tokenstakeInput | any>} A promise that resolves to the created admin staking record or an error.
     */
    async createStake(payload : tokenStakeDto) : Promise<tokenstakeInput | any>{
        return await stakingDal.createAdminStaking(payload);
    }
}

export default stakingService;