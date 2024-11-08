import depositDal from "../models/dal/deposit.dal";
import { depositOuput } from "../models/model/deposit.model";

class depositServices {


  /**
   * Retrieves a list of deposits for a specific user by their user ID.
   * 
   * @param {string} user_id - The user ID to filter deposits by.
   * @returns {Promise<depositOuput[]>} - Returns a promise resolving to an array of deposit outputs for the specified user.
   */

  async getDepositListById(user_id: string): Promise<depositOuput[]> {
    return depositDal.getListOfDepositById(user_id);
  }

    /**
   * Retrieves a list of all deposits.
   * 
   * @returns {Promise<depositOuput[]>} - Returns a promise resolving to an array of all deposit outputs.
   */
  async getDepositList(): Promise<depositOuput[]> {
    return depositDal.getListOfDeposit();
  }

    /**
   * Retrieves a paginated list of deposits based on offset and limit.
   * 
   * @param {any} offset - The starting index for the deposit list.
   * @param {any} limit - The number of records to fetch.
   * @returns {Promise<depositOuput[]>} - Returns a promise resolving to a paginated list of deposit outputs.
   */
  async getDepositListByLimit(offset:any,limit:any): Promise<depositOuput[]> {
    return depositDal.getDepositListByLimit(offset,limit);
  }

    /**
   * Retrieves a history of deposits for a specific user by their user ID.
   * 
   * @param {string} user_id - The user ID to filter deposit history by.
   * @returns {Promise<depositOuput[]>} - Returns a promise resolving to an array of deposit history for the specified user.
   */
  async getDepositHistoryById(user_id:string):Promise<depositOuput[]>{
    return depositDal.getHistoryOfDepositById(user_id);
  }
    /**
   * Retrieves a paginated and filtered deposit history for a specific user, with additional filters for currency and date.
   * 
   * @param {string} user_id - The user ID to filter deposit history by.
   * @param {string} offset - The starting index for the deposit history list.
   * @param {string} limit - The number of records to fetch.
   * @param {string} currency - The currency filter for deposits.
   * @param {string} date - The date filter for deposits.
   * @returns {Promise<depositOuput[]>} - Returns a promise resolving to a filtered and paginated list of deposit history outputs.
   */
  async getDepositHistoryByIdAndLimit(user_id:string, offset:string,limit:string,currency:string,date:string):Promise<depositOuput[]>{
    return depositDal.getHistoryOfDepositByIdLimit(user_id,offset,limit, currency,date);
  }
}

export default depositServices