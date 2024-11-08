import watchlistDal from "../models/dal/watchlist.dal";
import watchlistDto from "../models/dto/watchlist.dto";
import walletsModel, { watchlistOuput } from "../models/model/watchlist.model";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

class watchlistServices {

     /**
     * Creates a new watchlist entry.
     * 
     * @param payload - The data transfer object containing watchlist details.
     * @returns A Promise resolving to the created watchlist output.
     */
    async create(payload: watchlistDto): Promise<watchlistOuput> {
        return await watchlistDal.create(payload)
    }

     /**
     * Retrieves a list of watchlist entries for a specific user by their ID.
     * 
     * @param user_id - The unique identifier for the user.
     * @returns A Promise resolving to an array of watchlist entries associated with the user ID.
     */
    async listById(user_id: string): Promise<any> {
        return await watchlistDal.watchlistListById(user_id);
    }

    /**
     * Decrypts an encrypted payload string using the AES algorithm.
     * 
     * @param payload - The encrypted data in string format.
     * @returns A Promise resolving to the decrypted string, or throws an error if decryption fails.
     * @throws Throws an error if decryption fails, with the error message specified.
     */
    async decrypt(payload: string): Promise<any> {
        try {

            let key: any = process.env.ENCRYPTION_KEY;
            let pass = AES.decrypt(
                payload,
                key
            ).toString(enc.Utf8);

            return pass;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

}

export default watchlistServices