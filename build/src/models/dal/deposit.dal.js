"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deposit_model_1 = __importDefault(require("../model/deposit.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
class depositDal {
    /**
     * create new withdraw request
     * @param payload
     * @returns
     */
    async getListOfDepositById(id) {
        try {
            let deposit = await deposit_model_1.default.findAll({
                where: { user_id: id },
                attributes: {
                    exclude: ['id', 'deletedAt', 'updatedAt']
                },
                order: [["createdAt", "desc"]],
                raw: true
            });
            let data = deposit;
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfDeposit() {
        try {
            return await deposit_model_1.default.findAll();
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getDepositListByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await deposit_model_1.default.findAll({
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getHistoryOfDepositById(id) {
        try {
            let deposit = await deposit_model_1.default.findAll({
                where: { user_id: id },
                attributes: {
                    exclude: ['id', 'deletedAt', 'updatedAt']
                },
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
                order: [["createdAt", "desc"]],
            });
            let data = deposit;
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getHistoryOfDepositByIdLimit(id, offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let deposit = await deposit_model_1.default.findAll({
                where: { user_id: id },
                attributes: {
                    exclude: ['id', 'deletedAt', 'updatedAt']
                },
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
                order: [["createdAt", "desc"]],
                raw: true,
                offset: offsets,
                limit: limits
            });
            let data = deposit;
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new depositDal();
