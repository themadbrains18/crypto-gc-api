import { globalTokensModel } from "../models";
import tokenDal from "../models/dal/token.dal";
import tokenDto from "../models/dto/token.dto";
import { tokenInput, tokenOuput } from "../models/model/tokens.model";
import { updateTokenNetwork, updateTokenStakeStatus, updateTokenStatus } from "../utils/interface";
import service from "./service";

class tokenServices {

    /**
     * 
     * @returns return all published token 
     */
    async all(): Promise<any> {
        return await tokenDal.all();
    }

    async futureAll(): Promise<any> {
        return await tokenDal.futureAll();
    }


    async allWithLimit(offset: any, limit: any): Promise<any> {
        return await tokenDal.allWithLimit(offset, limit);
    }

    /**
     * 
     * @param payload if token contarct alread register
     * @returns 
     */
    async alreadyExist(payload: tokenDto): Promise<tokenOuput | any> {
        return await tokenDal.contarctIfExist(payload)
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: tokenDto): Promise<tokenOuput> {
        return await tokenDal.createToken(payload)
    }

    // ===================================
    // Admin services
    // ===================================
    async adminTokenAll(): Promise<any> {
        return await tokenDal.adminTokenAll();
    }

    /**
     * Active/Inactive token list by admin
     */

    async changeStatus(payload: updateTokenStatus): Promise<any> {
        return await tokenDal.changeStatus(payload);
    }

    async edit(payload: tokenDto): Promise<tokenOuput> {
        return await tokenDal.editToken(payload)
    }

    async changeStakeStatus(payload: updateTokenStakeStatus): Promise<any> {
        return await tokenDal.changeStakeStatus(payload);
    }

    async getSingleToken(contractAddrees: string): Promise<tokenOuput | null> {
        return await tokenDal.getSingleToken(contractAddrees);
    }

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

            // let position = await service.position.positionCron();
            // let openOrder = await service.openorder.openOrderCron();

        } catch (error) {
            console.log();

        }
    }

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