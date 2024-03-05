"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withdraw_dal_1 = __importDefault(require("../models/dal/withdraw.dal"));
const withdraw_model_1 = __importDefault(require("../models/model/withdraw.model"));
const ethereum_blockchain_1 = __importDefault(require("../blockchain/ethereum.blockchain"));
const service_1 = __importDefault(require("./service"));
const models_1 = require("../models");
class withdrawServices {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await withdraw_dal_1.default.createWithdrawRequest(payload);
    }
    async listById(user_id) {
        return await withdraw_dal_1.default.withdrawListById(user_id);
    }
    async historyById(user_id) {
        return await withdraw_dal_1.default.withdrawHistoryById(user_id);
    }
    async historyByIdLimit(user_id, offset, limit) {
        return await withdraw_dal_1.default.withdrawHistoryByIdLimit(user_id, offset, limit);
    }
    async getwithdrawList() {
        return withdraw_dal_1.default.getListOfWithdraw();
    }
    async getwithdrawListByLimit(offset, limit) {
        return withdraw_dal_1.default.getListOfWithdrawByLimit(offset, limit);
    }
    async releaseWithdrawAssets(payload) {
        try {
            let existWithdraw = await withdraw_model_1.default.findOne({ where: { id: payload?.id, status: 'pending' }, raw: true });
            if (existWithdraw) {
                let networkTrnx;
                let network = await service_1.default.network.networkById(payload?.networkId);
                let token = await models_1.tokensModel.findOne({ where: { id: payload?.tokenID }, raw: true });
                if (!token) {
                    token = await models_1.globalTokensModel.findOne({ where: { id: payload?.tokenID }, raw: true });
                }
                let contractNetworks = token.networks.filter((item) => {
                    return item?.id === network?.id;
                });
                if (network && network.rpcUrl !== undefined && network.chainId !== undefined && network.fullname !== undefined) {
                    let cova = new ethereum_blockchain_1.default(network.rpcUrl, network.chainId, network.fullname, network.chainId);
                    if (contractNetworks[0].contract !== "") {
                        // -------------------------------------------------
                        // Token based transaction
                        // -------------------------------------------------
                        networkTrnx = await cova.tokenTransaction(contractNetworks[0].contract, payload?.withdraw_wallet, "", (payload?.amount - parseFloat(payload?.fee)));
                    }
                    else {
                        // -------------------------------------------------
                        // Normal contract based transaction
                        // -------------------------------------------------
                        networkTrnx = await cova.normalTransaction(payload?.withdraw_wallet, (payload?.amount - parseFloat(payload?.fee)), "", 18);
                    }
                    if (networkTrnx?.receipt) {
                        let withdrawUpdate = await withdraw_model_1.default.update({ status: 'success', tx_hash: networkTrnx?.receipt?.transactionHash }, { where: { id: payload?.id } });
                    }
                }
                return networkTrnx;
            }
            else {
                throw new Error('This type withdraw not exist');
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = withdrawServices;
