import withdrawDal from "../models/dal/withdraw.dal";
import withdrawDto from "../models/dto/withdraw.dto";
import withdrawModel, { assetOuput } from "../models/model/withdraw.model";
import ethereum from "../blockchain/ethereum.blockchain";
import service from "./service";
import { networkInput } from "../models/model/network.model";
import { globalTokensModel, tokensModel } from "../models";

class withdrawServices {


    /**
     * 
     * @param payload 
     * @returns 
     */

    async create(payload: withdrawDto): Promise<assetOuput> {
        return await withdrawDal.createWithdrawRequest(payload)
    }

    async listById(user_id: string): Promise<any> {
        return await withdrawDal.withdrawListById(user_id);
    }

    async historyById(user_id: string): Promise<any> {
        return await withdrawDal.withdrawHistoryById(user_id);
    }
    async historyByIdLimit(user_id: string, offset: string, limit: string, currency:string, date:string): Promise<any> {
        return await withdrawDal.withdrawHistoryByIdLimit(user_id, offset, limit, currency, date);
    }

    async getwithdrawList(): Promise<assetOuput[]> {
        return withdrawDal.getListOfWithdraw();
    }
    async getwithdrawListByLimit(offset: string, limit: string): Promise<assetOuput[]> {
        return withdrawDal.getListOfWithdrawByLimit(offset, limit);
    }

    async releaseWithdrawAssets(payload: withdrawDto): Promise<any> {
        try {

            let existWithdraw = await withdrawModel.findOne({ where: { id: payload?.id, status: 'pending' }, raw: true });
            if (existWithdraw) {
                let networkTrnx;
                let network: networkInput = await service.network.networkById(payload?.networkId);

                let token: any = await tokensModel.findOne({ where: { id: payload?.tokenID }, raw: true });
                if (!token) {
                    token = await globalTokensModel.findOne({ where: { id: payload?.tokenID }, raw: true });
                }

                let contractNetworks = token.networks.filter((item: any) => {
                    return item?.id === network?.id
                });

                if (network && network.rpcUrl !== undefined && network.chainId !== undefined && network.fullname !== undefined) {
                    let cova = new ethereum(network.rpcUrl, network.chainId, network.fullname, network.chainId);
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
                        networkTrnx = await cova.normalTransaction(payload?.withdraw_wallet,(payload?.amount - parseFloat(payload?.fee)),"",18);
                    }

                    if (networkTrnx?.receipt) {
                        let withdrawUpdate = await withdrawModel.update({ status: 'success', tx_hash: networkTrnx?.receipt?.transactionHash }, { where: { id: payload?.id } });
                    }
                }
                return networkTrnx;
            }
            else {
                throw new Error('This type withdraw not exist');
            }

        } catch (error: any) {
            throw new Error(error);
        }

    }
}

export default withdrawServices