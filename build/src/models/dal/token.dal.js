"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const sequelize_1 = require("sequelize");
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const tokenstake_model_1 = __importDefault(require("../model/tokenstake.model"));
const index_1 = require("../index");
const tradePair_model_1 = __importDefault(require("../model/tradePair.model"));
const marketProfit_model_1 = __importDefault(require("../model/marketProfit.model"));
class tokenDal {
    /**
     * return all tokens data
     * @returns
     */
    async all() {
        let tokens = await tokens_model_1.default.findAll({
            where: { status: true },
            include: [
                {
                    model: tokenstake_model_1.default,
                },
                {
                    model: tradePair_model_1.default
                }
            ],
        });
        let globalTokens = await global_token_model_1.default.findAll({
            where: { status: true },
            include: [
                {
                    model: tokenstake_model_1.default,
                },
                {
                    model: tradePair_model_1.default
                }
            ],
            order: [["rank", "ASC"]],
        });
        let allTokens = tokens.concat(globalTokens);
        return allTokens;
    }
    async futureAll() {
        let tokens = await tokens_model_1.default.findAll({
            where: { status: true },
            include: [
                {
                    model: tokenstake_model_1.default,
                },
                {
                    model: tradePair_model_1.default
                },
                {
                    model: index_1.futureTradePairModel
                }
            ],
        });
        let globalTokens = await global_token_model_1.default.findAll({
            where: { status: true },
            include: [
                {
                    model: tokenstake_model_1.default,
                },
                {
                    model: tradePair_model_1.default
                },
                {
                    model: index_1.futureTradePairModel
                }
            ],
            order: [["rank", "ASC"]],
        });
        let allTokens = tokens.concat(globalTokens);
        return allTokens;
    }
    /**
     * return all tokens data
     * @returns
     */
    async allWithLimit(offset, limit) {
        let offsets = parseInt(offset);
        let limits = parseInt(limit);
        let tokens = await tokens_model_1.default.findAll({
            include: [
                {
                    model: tokenstake_model_1.default,
                },
            ],
            limit: limits,
            offset: offsets,
        });
        if (tokens.length > 0 && tokens.length < limits) {
            limits = limits - tokens.length;
            offsets = 0;
        }
        else if (tokens.length >= limits) {
            offsets = offsets;
        }
        else {
            let TokensLimit = await tokens_model_1.default.findAll();
            offsets = offsets - TokensLimit.length;
        }
        let globalTokens = await global_token_model_1.default.findAll({
            include: [
                {
                    model: tokenstake_model_1.default,
                },
            ],
            order: [["rank", "ASC"]],
            limit: limits,
            offset: offsets,
        });
        let allTokens = tokens.concat(globalTokens).slice(0, 10);
        return allTokens;
    }
    /**
     *
     * @param payload if contract already register
     * @returns
     */
    async contarctIfExist(payload) {
        let contractList = [];
        if (payload?.networks != undefined && payload?.networks.length > 0) {
            for (let item of payload?.networks) {
                if (item.hasOwnProperty("contract")) {
                    contractList.push(item.contract);
                }
            }
        }
        //  if token is already register then trigger error
        if (contractList.length > 0) {
            let condition = contractList.map((item) => sequelize_1.Sequelize.where(sequelize_1.Sequelize.col("networks"), // Just 'name' also works if no joins
            sequelize_1.Op.like, `%${item}%`));
            let data = await tokens_model_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: condition,
                },
                raw: true,
            });
            return data;
        }
        return [];
    }
    /**
     * create new token
     * @param payload
     * @returns
     */
    async createToken(payload) {
        try {
            let created = await tokens_model_1.default.create(payload);
            if (created) {
                try {
                    let profit = {
                        source_id: created?.dataValues?.id,
                        total_usdt: 0,
                        paid_usdt: 0,
                        admin_usdt: 0,
                        buyer: '',
                        seller: '',
                        profit: 0,
                        fees: 0,
                        coin_type: 'USDT',
                        source_type: 'Token Listing',
                        listing_fee: payload?.fees,
                    };
                    await marketProfit_model_1.default.create(profit);
                    return created;
                }
                catch (error) {
                    throw new Error(error.message);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async editToken(payload) {
        try {
            if (payload.image === "") {
                delete payload.image;
            }
            return await tokens_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    // ==========================================
    // Admin APi
    // ==========================================
    async adminTokenAll() {
        let tokens = await tokens_model_1.default.findAll({
            include: [
                {
                    model: tokenstake_model_1.default,
                },
            ],
            raw: true
        });
        let globalTokens = await global_token_model_1.default.findAll({
            include: [
                {
                    model: tokenstake_model_1.default,
                },
            ],
            order: [["rank", "ASC"]],
            raw: true
        });
        let allTokens = tokens.concat(globalTokens);
        return allTokens;
    }
    async changeStatus(payload) {
        try {
            let global_token = await global_token_model_1.default.findOne({
                where: { id: payload?.id }, raw: true
            });
            let token = await tokens_model_1.default.findOne({
                where: { id: payload?.id }, raw: true
            });
            let apiStatus;
            if (token) {
                apiStatus = await tokens_model_1.default.update({
                    status: (token?.status === true || token?.status === 1) ? false : true,
                }, { where: { id: payload?.id } });
            }
            else if (global_token) {
                apiStatus = await global_token_model_1.default.update({
                    status: (global_token?.status === true || global_token?.status === 1) ? false : true,
                }, { where: { id: payload?.id } });
            }
            return apiStatus;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async changeStakeStatus(payload) {
        try {
            let tokenStake = await tokenstake_model_1.default.findOne({
                where: { id: payload?.id },
            });
            let apiStatus;
            if (tokenStake) {
                apiStatus = await tokenStake.update({
                    status: tokenStake?.dataValues?.status === true ? false : true,
                });
            }
            return apiStatus;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getSingleToken(contractAddress) {
        try {
            let condition = index_1.Database.where(index_1.Database.col('networks'), // Just 'name' also works if no joins
            sequelize_1.Op.like, `%${contractAddress}%`);
            let token = await tokens_model_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: condition
                },
                raw: true
            });
            return token;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateNetwork(payload) {
        try {
            let response = await global_token_model_1.default.update({ networks: payload.networks }, { where: { id: payload?.id } });
            if (response[0] === 1) {
                console.log('here update successfully!!');
                return await global_token_model_1.default.findOne({ where: { id: payload?.id }, raw: true });
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new tokenDal();
