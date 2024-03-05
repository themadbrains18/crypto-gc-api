"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const covalenthq_1 = __importDefault(require("../blockchain/scaner/covalenthq"));
const models_1 = require("../models");
class scannerService {
    async scanUserDeposits() {
        try {
            // return;
            // let remainingTransferToAdmin = await depositModel.findAll({
            //     where: {
            //         transferHash: "", contract: { [Op.not]: "" }, cronStatus: {
            //             [Op.or]: [0, false]
            //         }
            //     }, raw: true
            // });
            // for await (const d of remainingTransferToAdmin) {
            //     await depositModel.update({ cronStatus: true }, { where: { id: d.id } });
            //     let network: networkInput = await service.network.networkById(d.network);
            //     if (network && network.rpcUrl !== undefined && network.chainId !== undefined && network.fullname !== undefined) {
            //         let cova = new ethereum(network.rpcUrl, network.chainId, network.fullname, network.chainId);
            //         await cova.tokenTransferToAdmin(d);
            //     }
            // }
            // return
            let users = await models_1.userModel.findAll({
                where: { role: 'user' },
                raw: true, attributes: {
                    exclude: [
                        "email",
                        "password",
                        "deletedAt",
                        "cronStatus",
                        "updatedAt",
                        "createdAt",
                        "createdAt",
                        "UID",
                        "antiphishing",
                        "registerType",
                        "statusType",
                        "tradingPassword",
                        "kycstatus",
                        "TwoFA",
                        "otpToken", "own_code",
                        "refeer_code", "secret",
                        "number",
                        "dial_code",
                        "role",
                        "pin_code"
                    ],
                },
            });
            let chainsIds = process.env.TESTNET_CHAINIDS;
            if (chainsIds !== undefined) {
                for await (const chain of JSON.parse(chainsIds)) {
                    for await (const u of users) {
                        let userWallet = await models_1.walletsModel.findOne({ where: { user_id: u.id }, raw: true });
                        let address = userWallet?.wallets?.eth?.address;
                        let cova = new covalenthq_1.default();
                        let trns = await cova.scanner(address, +chain, u.id);
                    }
                }
            }
        }
        catch (error) {
            console.log(error, '----cron scan error---');
        }
    }
}
exports.default = scannerService;
