"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const token_dal_1 = __importDefault(require("../models/dal/token.dal"));
const service_1 = __importDefault(require("./service"));
class tokenServices {
    /**
     *
     * @returns return all published token
     */
    async all() {
        return await token_dal_1.default.all();
    }
    async futureAll() {
        return await token_dal_1.default.futureAll();
    }
    async allWithLimit(offset, limit) {
        return await token_dal_1.default.allWithLimit(offset, limit);
    }
    /**
     *
     * @param payload if token contarct alread register
     * @returns
     */
    async alreadyExist(payload) {
        return await token_dal_1.default.contarctIfExist(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await token_dal_1.default.createToken(payload);
    }
    // ===================================
    // Admin services
    // ===================================
    async adminTokenAll() {
        return await token_dal_1.default.adminTokenAll();
    }
    /**
     * Active/Inactive token list by admin
     */
    async changeStatus(payload) {
        return await token_dal_1.default.changeStatus(payload);
    }
    async edit(payload) {
        return await token_dal_1.default.editToken(payload);
    }
    async changeStakeStatus(payload) {
        return await token_dal_1.default.changeStakeStatus(payload);
    }
    async getSingleToken(contractAddrees) {
        return await token_dal_1.default.getSingleToken(contractAddrees);
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
                // console.log(num);
                let exist = await models_1.globalTokensModel.findOne({ where: { symbol: num.code === 'BTC' ? 'BTCB' : num.code }, raw: true });
                if (exist) {
                    let payload = {
                        id: exist?.id,
                        symbol: num.code === 'BTC' ? 'BTCB' : num.code,
                        fullName: num.name,
                        image: num.png32,
                        price: num.rate,
                        maxSupply: num.maxSupply,
                        totalSupply: num.totalSupply,
                        circulatingSupply: num.circulatingSupply,
                        rank: num.rank
                    };
                    await models_1.globalTokensModel.update(payload, { where: { id: exist?.id } });
                }
            }
            let position = await service_1.default.position.positionCron();
            let openOrder = await service_1.default.openorder.openOrderCron();
        }
        catch (error) {
            console.log();
        }
    }
    async updateGlobalTokenNetwork(payload) {
        return await token_dal_1.default.updateNetwork(payload);
    }
}
exports.default = tokenServices;
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
