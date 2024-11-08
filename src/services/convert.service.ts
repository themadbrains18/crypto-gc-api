import convertDal from "../models/dal/convert.dal";
import convertDto from "../models/dto/convert.dto";
import convertHistoryDto from "../models/dto/convertHistory.dto";
import { convertOuput } from "../models/model/convert.model";
import { convertHistoryOuput } from "../models/model/convertHistory.model";

class convertService {

    /**
     * Creates a new conversion record.
     * 
     * @param {convertDto} payload - The data transfer object containing the conversion details.
     * @returns {Promise<convertOuput | any>} - Returns a promise that resolves to the created conversion record or an error.
     */
    async create(payload: convertDto): Promise<convertOuput | any> {
        return await convertDal.createConvert(payload);
    }

    /**
     * Creates a new conversion history record.
     * 
     * @param {convertHistoryDto} payload - The data transfer object containing the conversion history details.
     * @returns {Promise<convertHistoryOuput | any>} - Returns a promise that resolves to the created conversion history record or an error.
     */
    async createhistory(payload: convertHistoryDto): Promise<convertHistoryOuput | any> {
        return await convertDal.createConvertHistory(payload);
    }

    /**
     * Retrieves a list of conversion records for a specific user, with pagination.
     * 
     * @param {string} user_id - The user ID for which to fetch the conversion records.
     * @param {any} offset - The starting index for the pagination.
     * @param {any} limit - The number of records to retrieve.
     * @returns {Promise<convertOuput | any>} - Returns a promise resolving to an array of conversion records for the user.
     */
    async getConvertRecord(user_id: string, offset: any, limit: any): Promise<convertOuput | any> {
        return await convertDal.getRecord(user_id, offset, limit);
    }

    /**
     * Retrieves the full history of conversions for a specific user.
     * 
     * @param {string} user_id - The user ID for which to fetch the conversion history.
     * @returns {Promise<convertHistoryOuput | any>} - Returns a promise resolving to an array of conversion history records.
     */
    async getConvertHistory(user_id: string): Promise<convertHistoryOuput | any> {
        return await convertDal.getHistoryRecord(user_id);
    }
    /**
     * Retrieves a paginated list of conversion history records for a specific user.
     * 
     * @param {string} user_id - The user ID for which to fetch the conversion history.
     * @param {any} offset - The starting index for the pagination.
     * @param {any} limit - The number of records to retrieve.
     * @returns {Promise<convertHistoryOuput | any>} - Returns a promise resolving to a paginated list of conversion history records.
     */
    async getConvertHistoryByLimit(user_id: string, offset: any, limit: any): Promise<convertHistoryOuput | any> {
        return await convertDal.getHistoryRecordByLimit(user_id, offset, limit);
    }
}

export default convertService;