import depositDal from "../models/dal/deposit.dal";
import { depositOuput } from "../models/model/deposit.model";

class depositServices {


  /**
   * 
   * @param payload 
   * @returns 
   */

  async getDepositListById(user_id: string): Promise<depositOuput[]> {
    return depositDal.getListOfDepositById(user_id);
  }
  async getDepositList(): Promise<depositOuput[]> {
    return depositDal.getListOfDeposit();
  }
  async getDepositListByLimit(offset:any,limit:any): Promise<depositOuput[]> {
    return depositDal.getDepositListByLimit(offset,limit);
  }

  async getDepositHistoryById(user_id:string):Promise<depositOuput[]>{
    return depositDal.getHistoryOfDepositById(user_id);
  }
  async getDepositHistoryByIdAndLimit(user_id:string, offset:string,limit:string,currency:string,date:string):Promise<depositOuput[]>{
    return depositDal.getHistoryOfDepositByIdLimit(user_id,offset,limit, currency,date);
  }
}

export default depositServices