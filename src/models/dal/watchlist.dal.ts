import watchlistDto from "../dto/watchlist.dto";
import globalTokensModel from "../model/global_token.model";
import tokensModel from "../model/tokens.model";
import watchlistModel, { watchlistOuput } from "../model/watchlist.model";

class watchlistDal {
    /**
     * create new token
     * @param payload
     * @returns
     */

    async create(payload: watchlistDto): Promise<watchlistOuput | any> {
        try {
            return await watchlistModel.create(payload);
        } catch (error: any) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    async watchlistListById(user_id: string): Promise<watchlistOuput | any> {
        try {
            let list = await watchlistModel.findAll({ where: { user_id: user_id },include:[
                {
                    model: tokensModel
                },
                {
                    model : globalTokensModel
                }
            ] });
            return list;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default new watchlistDal();
