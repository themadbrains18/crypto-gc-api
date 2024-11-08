import watchlistDto from "../dto/watchlist.dto";
import globalTokensModel from "../model/global_token.model";
import tokensModel from "../model/tokens.model";
import watchlistModel, { watchlistOuput } from "../model/watchlist.model";

class watchlistDal {
     /**
     * Creates a new token in the watchlist.
     * 
     * This method receives a payload containing information for creating a new 
     * watchlist entry and persists it in the database. It returns the created 
     * watchlist entry or throws an error in case of failure.
     * 
     * @param {watchlistDto} payload - The data transfer object containing details of the watchlist entry.
     * @returns {Promise<watchlistOuput | any>} The newly created watchlist entry or an error object if the creation fails.
     * @throws {Error} Throws an error if the creation fails.
     */
    async create(payload: watchlistDto): Promise<watchlistOuput | any> {
        try {
            return await watchlistModel.create(payload);
        } catch (error: any) {
            console.log(error)
            throw new Error(error.message);
        }
    }

     /**
     * Retrieves a list of watchlist entries by user ID.
     * 
     * This method fetches the list of tokens from the user's watchlist, along with 
     * additional data from related models like `tokensModel` and `globalTokensModel`. 
     * The results are returned as a list of watchlist entries.
     * 
     * @param {string} user_id - The user ID for which the watchlist is fetched.
     * @returns {Promise<watchlistOuput | any>} A list of watchlist entries associated with the user or an error object.
     * @throws {Error} Throws an error if the retrieval fails.
     */
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
