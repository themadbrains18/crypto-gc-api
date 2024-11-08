import ethereum from "../blockchain/ethereum.blockchain";
import covalenthq from "../blockchain/scaner/covalenthq";
import { Op, depositModel, userModel, walletsModel } from "../models";
import { networkInput } from "../models/model/network.model";
import service from "./service";

class scannerService {
      /**
     * Scans user deposits and performs related actions.
     * 
     * This method scans user deposits for transactions that need to be transferred to an admin. It checks for any pending transfers,
     * updates their status, and triggers a token transfer if conditions are met. The method retrieves the network configuration 
     * and uses a blockchain service to facilitate the transfer to the admin wallet.
     * 
     * @returns {Promise<any>} A promise indicating the result of the scanning process.
     */
    async scanUserDeposits(): Promise<any> {
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
            let users = await userModel.findAll({
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

            let chainsIds = process.env.TESTNET_CHAINIDS
            if (chainsIds !== undefined) {
                for await (const chain of JSON.parse(chainsIds)) {
                    for await (const u of users) {
                        let userWallet: any = await walletsModel.findOne({ where: { user_id: u.id }, raw: true });
                        let address = userWallet?.wallets?.eth?.address;

                        let cova = new covalenthq();
                        let trns = await cova.scanner(address, +chain, u.id);
                    }
                }
            }

        } catch (error: any) {
            console.log(error, '----cron scan error---');
        }
    }
}

export default scannerService;