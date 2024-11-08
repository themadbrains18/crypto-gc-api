import withdrawDal from "../models/dal/withdraw.dal";
import withdrawDto from "../models/dto/withdraw.dto";
import withdrawModel, { assetOuput } from "../models/model/withdraw.model";
import ethereum from "../blockchain/ethereum.blockchain";
import service from "./service";
import { networkInput } from "../models/model/network.model";
import { globalTokensModel, tokensModel } from "../models";

class withdrawServices {


   /**
     * Creates a new withdrawal request.
     * 
     * @param payload - The data transfer object (DTO) containing withdrawal details.
     * @returns A Promise that resolves to the withdrawal asset output.
     */
    async create(payload: withdrawDto): Promise<assetOuput> {
        return await withdrawDal.createWithdrawRequest(payload)
    }

      /**
     * Retrieves a list of withdrawals for a specific user.
     * 
     * @param user_id - The ID of the user whose withdrawals are to be retrieved.
     * @returns A Promise that resolves to a list of withdrawal entries for the specified user.
     */
    async listById(user_id: string): Promise<any> {
        return await withdrawDal.withdrawListById(user_id);
    }

     /**
     * Retrieves the withdrawal history for a specific user.
     * 
     * @param user_id - The ID of the user whose withdrawal history is to be retrieved.
     * @returns A Promise that resolves to the user's withdrawal history.
     */
    async historyById(user_id: string): Promise<any> {
        return await withdrawDal.withdrawHistoryById(user_id);
    }

     /**
     * Retrieves a paginated withdrawal history for a specific user, with optional filters.
     * 
     * @param user_id - The ID of the user whose withdrawal history is to be retrieved.
     * @param offset - The number of entries to skip (for pagination).
     * @param limit - The maximum number of entries to retrieve.
     * @param currency - The currency filter for the withdrawal history.
     * @param date - The date filter for the withdrawal history.
     * @returns A Promise that resolves to the paginated withdrawal history for the user.
     */
    async historyByIdLimit(user_id: string, offset: string, limit: string, currency:string, date:string): Promise<any> {
        return await withdrawDal.withdrawHistoryByIdLimit(user_id, offset, limit, currency, date);
    }

        /**
     * Retrieves the list of all withdrawal requests.
     * 
     * @returns A Promise that resolves to an array of withdrawal asset outputs.
     */
    async getwithdrawList(): Promise<assetOuput[]> {
        return withdrawDal.getListOfWithdraw();
    }

      /**
     * Retrieves a limited list of withdrawal requests with pagination.
     * 
     * @param offset - The number of records to skip for pagination.
     * @param limit - The maximum number of records to return.
     * @returns A Promise resolving to an array of withdrawal asset outputs within the specified limits.
     */
    async getwithdrawListByLimit(offset: string, limit: string): Promise<assetOuput[]> {
        return withdrawDal.getListOfWithdrawByLimit(offset, limit);
    }

     /**
     * Releases withdraw assets after verifying the withdrawal and executing a blockchain transaction.
     * 
     * @param payload - The DTO containing withdrawal details, including amount, fee, network, and token information.
     * @returns A Promise resolving to the network transaction object if the transaction is successful.
     * @throws An error if the withdrawal does not exist, the token is invalid, or the transaction fails.
     */
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