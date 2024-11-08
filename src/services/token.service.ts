import { globalTokensModel } from "../models";
import tokenDal from "../models/dal/token.dal";
import tokenDto from "../models/dto/token.dto";
import { tokenInput, tokenOuput } from "../models/model/tokens.model";
import { updateTokenNetwork, updateTokenStakeStatus, updateTokenStatus } from "../utils/interface";
import service from "./service";

class tokenServices {

    /**
     * Retrieves all published tokens.
     * 
     * @returns {Promise<any>} A promise that resolves to a list of all published tokens.
     */
    async all(): Promise<any> {
        return await tokenDal.all();
    }


    /**
     * Retrieves tokens that are scheduled for future publication.
     * 
     * @returns {Promise<any>} A promise that resolves to a list of future tokens.
     */
    async futureAll(): Promise<any> {
        return await tokenDal.futureAll();
    }

/**
     * Retrieves tokens with pagination (offset and limit).
     * 
     * @param {any} offset The starting point for the tokens to retrieve.
     * @param {any} limit The maximum number of tokens to retrieve.
     * @returns {Promise<any>} A promise that resolves to a list of tokens based on the provided offset and limit.
     */
    async allWithLimit(offset: any, limit: any): Promise<any> {
        return await tokenDal.allWithLimit(offset, limit);
    }

   /**
     * Checks if a token contract is already registered.
     * 
     * @param {tokenDto} payload The token contract details to check.
     * @returns {Promise<tokenOuput | any>} A promise that resolves to token details if it exists, otherwise null.
     */
    async alreadyExist(payload: tokenDto): Promise<tokenOuput | any> {
        return await tokenDal.contarctIfExist(payload)
    }

   /**
     * Creates a new token.
     * 
     * @param {tokenDto} payload The token details to create.
     * @returns {Promise<tokenOuput>} A promise that resolves to the newly created token.
     */
    async create(payload: tokenDto): Promise<tokenOuput> {
        return await tokenDal.createToken(payload)
    }

    // ===================================
    // Admin services
    // ===================================

    /**
     * Retrieves all tokens for admin purposes.
     * 
     * @returns {Promise<any>} A promise that resolves to a list of all tokens for the admin.
     */
    async adminTokenAll(): Promise<any> {
        return await tokenDal.adminTokenAll();
    }

 
    /**
     * Changes the active/inactive status of a token.
     * 
     * @param {updateTokenStatus} payload The token status update details.
     * @returns {Promise<any>} A promise that resolves to the updated token status.
     */
    async changeStatus(payload: updateTokenStatus): Promise<any> {
        return await tokenDal.changeStatus(payload);
    }

     /**
     * Edits an existing token's details.
     * 
     * @param {tokenDto} payload The new token details to update.
     * @returns {Promise<tokenOuput>} A promise that resolves to the updated token details.
     */
    async edit(payload: tokenDto): Promise<tokenOuput> {
        return await tokenDal.editToken(payload)
    }

     /**
     * Changes the stake status of a token.
     * 
     * @param {updateTokenStakeStatus} payload The token's staking status update.
     * @returns {Promise<any>} A promise that resolves to the updated staking status.
     */
    async changeStakeStatus(payload: updateTokenStakeStatus): Promise<any> {
        return await tokenDal.changeStakeStatus(payload);
    }

     /**
     * Retrieves a single token by its contract address.
     * 
     * @param {string} contractAddrees The contract address of the token.
     * @returns {Promise<tokenOuput | null>} A promise that resolves to the token details or null if not found.
     */
    async getSingleToken(contractAddrees: string): Promise<tokenOuput | null> {
        return await tokenDal.getSingleToken(contractAddrees);
    }

       /**
     * Fetches the latest token prices from an external API and updates the database.
     * 
     * This method fetches token data from the `livecoinwatch` API, iterates over the results,
     * and updates the global tokens in the database with the new prices, market cap, 
     * circulating supply, and other related data.
     * 
     * After updating the global token prices, the method triggers additional operations to 
     * update positions and open orders.
     * 
     * @returns {Promise<void>} A promise that resolves once the global token prices have been updated.
     */
    async updateGlobalTokenPrice() {
        try {
            let coinList = await fetch("https://api.livecoinwatch.com/coins/list", {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                    "x-api-key": "b9e6cfd4-90f6-476e-ab4d-be87eb40c67c",
                }),
                body: JSON.stringify({
                    currency: "USD",
                    sort: "rank",
                    order: "ascending",
                    offset: 0,
                    limit: 100,
                    meta: true,
                }),
            });

            let data = await coinList.json();


            for await (const num of data) {
                let symbol = num.code === 'BTC' ? 'BTCB' : num.code === 'BNB' ? 'BNBT' : num.code;
                let exist: any = await globalTokensModel.findOne({ where: { symbol: symbol }, raw: true });
                if (exist) {
                    let payload = {
                        id: exist?.id,
                        symbol: symbol,
                        fullName: num.name,
                        image: num.png32,
                        price: num.rate,
                        maxSupply: num.maxSupply,
                        totalSupply: num.totalSupply,
                        circulatingSupply: num.circulatingSupply,
                        marketcap: num?.cap,
                        volume: num?.volume,
                        rank: num.rank
                    }
                    await globalTokensModel.update(payload, { where: { id: exist?.id } });
                }
            }

            let position = await service.position.positionCron();
            let openOrder = await service.openorder.openOrderCron();

        } catch (error) {
            console.log();

        }
    }

       /**
     * Updates the token network information.
     * 
     * @param {updateTokenNetwork} payload The network update details for the token.
     * @returns {Promise<any>} A promise that resolves to the updated token network information.
     */
    async updateGlobalTokenNetwork(payload: updateTokenNetwork): Promise<any> {
        return await tokenDal.updateNetwork(payload);
    }
}

export default tokenServices;

// let coinList = await fetch("https://api.livecoinwatch.com/coins/list", {
//     method: "POST",
//     headers: new Headers({
//         "content-type": "application/json",
//         "x-api-key": "543bc2be-caf7-4e9c-b83d-1eb9c6d08c20",
//     }),
//     body: JSON.stringify({
//         currency: "USD",
//         sort: "rank",
//         order: "ascending",
//         offset: 0,
//         limit: 100,
//         meta: true,
//     }),
// });

// let data = await coinList.json();
// for await (const num of data) {
//     console.log(num);
//     let exist = await globalTokensModel.findOne({ where: { symbol: num.code }, raw : true });
//     if (!exist) {
//         let payload = {
//             id : exist?.id
//             symbol: num.code,
//             fullName: num.name,
//             image: num.png32,
//             price: num.rate,
//             maxSupply: num.maxSupply,
//             totalSupply: num.totalSupply,
//             circulatingSupply: num.circulatingSupply,
//             rank: num.rank
//         }
//         await globalTokensModel.create(payload);
//         await globalTokensModel.update(payload,{where : {id : exist?.id}});
//     }
// }
// return [];