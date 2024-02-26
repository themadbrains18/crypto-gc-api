import watchlistDal from "../models/dal/watchlist.dal";
import watchlistDto from "../models/dto/watchlist.dto";
import walletsModel, { watchlistOuput } from "../models/model/watchlist.model";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

class watchlistServices {

    async create(payload: watchlistDto): Promise<watchlistOuput> {
        return await watchlistDal.create(payload)
    }

    async listById(user_id: string): Promise<any> {
        return await watchlistDal.watchlistListById(user_id);
    }

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