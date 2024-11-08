import assetsDal from "../models/dal/assets.dal";
import assetsDto from "../models/dto/assets.dto";
import assetModel, {assetInput, assetOuput } from "../models/model/assets.model";
import { assetsWalletType, userAssetData } from "../utils/interface";

class assetsService{

    /**
     * Creates a new asset entry.
     * @param payload - The asset data to create.
     * @returns - The created asset.
     */
    async create(payload : assetsDto) : Promise<assetOuput | any>{
        return await assetsDal.createAssets(payload);
    }

    /**
     * Transfers assets from one wallet to another.
     * @param payload - The asset transfer data.
     * @returns - The asset transfer result.
     */
    async walletTowalletTranserfer(payload : assetsDto) : Promise<assetOuput | any>{
        return await assetsDal.walletTowalletTranserfer(payload);
    }
    /**
     * Retrieves an overview of assets.
     * @param payload - The user or asset identifier.
     * @returns - The asset overview.
     */
    async assetsOverview(payload :string) : Promise<assetOuput | any>{
        return await assetsDal.assetsOverview(payload);
    }
    /**
     * Retrieves an overview of assets with pagination.
     * @param payload - The user or asset identifier.
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @returns - The asset overview with pagination.
     */
    async assetsOverviewByLimit(payload :string,offset:string,limit:string) : Promise<assetOuput | any>{
        return await assetsDal.assetsOverviewByLimit(payload,offset,limit);
    }
    /**
     * Retrieves an overview of assets by type with pagination.
     * @param payload - The user or asset identifier.
     * @param type - The asset type (e.g., token, coin).
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @returns - The asset overview by type with pagination.
     */
    async assetsOverviewByType(payload :string,type:string,offset:string,limit:string) : Promise<assetOuput | any>{
        return await assetsDal.assetsOverviewByType(payload,type,offset,limit);
    }

    /**
     * Retrieves the list of assets.
     * @returns - The list of assets.
     */
    async getAssetsList():Promise<assetOuput | any>{
        return await assetsDal.getAssetsList();
    }
    /**
     * Retrieves the list of assets with pagination.
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @returns - The list of assets with pagination.
     */
    async getAssetsListByLimit(offset:string,limit:string):Promise<assetOuput | any>{
        return await assetsDal.getAssetsListByLimit(offset,limit);
    }

    /**
     * Retrieves the wallet-to-wallet transfer history.
     * @param payload - The user or asset identifier.
     * @returns - The transfer history.
     */
    async transferHistory(payload :string) : Promise<assetOuput | any>{
        return await assetsDal.getWalletToWalletTransferHistory(payload);
    }

        /**
     * Retrieves the user's asset based on token ID and wallet type.
     * @param payload - The user ID, token ID, and wallet type.
     * @returns - The user's asset.
     */
    async getUserAssetByTokenIdandWallet(payload: userAssetData):Promise<assetOuput | any>{
        try {
            let assets = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: assetsWalletType.main_wallet }, raw :true});

            return assets;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }
}

export default assetsService;