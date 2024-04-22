import stakingDal from "../models/dal/staking.dal";
import {stakingDto, tokenStakeDto} from "../models/dto/staking.dto";
import stakingModel, { stakingOuput } from "../models/model/staking.model";
import { tokenstakeInput } from "../models/model/tokenstake.model";

class stakingService{
    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload : stakingDto) : Promise<stakingOuput | any>{
        return await stakingDal.createStaking(payload);
    }

    async getAllStaking(user_id:string):Promise<stakingOuput | any>{
        return await stakingDal.getAllStaking(user_id);
    }
    async getAllStakingByLimit(user_id:string,offset:string,limit:string):Promise<stakingOuput | any>{
        return await stakingDal.getAllStakingByLimit(user_id,offset,limit);
    }

    async getStakingByToken(token_id : string, user_id: string):Promise<stakingOuput | any>{
        return await stakingDal.getStakingDataByTokenId(token_id, user_id);
    }

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

    async stakingCron(){
        stakingDal.cronStaking();
    }

    async releaseStaking(payload: string): Promise<stakingOuput | any> {
        return await stakingDal.releaseStaking(payload);
    }

    async createStake(payload : tokenStakeDto) : Promise<tokenstakeInput | any>{
        return await stakingDal.createAdminStaking(payload);
    }
}

export default stakingService;