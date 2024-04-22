import convertDal from "../models/dal/convert.dal";
import convertDto from "../models/dto/convert.dto";
import convertHistoryDto from "../models/dto/convertHistory.dto";
import { convertOuput } from "../models/model/convert.model";
import { convertHistoryOuput } from "../models/model/convertHistory.model";

class convertService{

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload : convertDto) : Promise<convertOuput | any>{
        return await convertDal.createConvert(payload);
    }

    async createhistory(payload : convertHistoryDto) : Promise<convertHistoryOuput | any>{
        return await convertDal.createConvertHistory(payload);
    }

    async getConvertRecord(user_id : string,offset:any,limit:any) : Promise<convertOuput | any>{
        return await convertDal.getRecord(user_id,offset,limit);
    }

    async getConvertHistory(user_id : string) : Promise<convertHistoryOuput | any>{
        return await convertDal.getHistoryRecord(user_id);
    }
    async getConvertHistoryByLimit(user_id : string, offset:any,limit:any) : Promise<convertHistoryOuput | any>{
        return await convertDal.getHistoryRecordByLimit(user_id,offset,limit);
    }
}

export default convertService;