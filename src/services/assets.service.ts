import assetsDal from "../models/dal/assets.dal";
import assetsDto from "../models/dto/assets.dto";
import assetModel, {assetInput, assetOuput } from "../models/model/assets.model";
import { assetsWalletType, userAssetData } from "../utils/interface";

class assetsService{

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload : assetsDto) : Promise<assetOuput | any>{
        return await assetsDal.createAssets(payload);
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async walletTowalletTranserfer(payload : assetsDto) : Promise<assetOuput | any>{
        return await assetsDal.walletTowalletTranserfer(payload);
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async assetsOverview(payload :string) : Promise<assetOuput | any>{
        return await assetsDal.assetsOverview(payload);
    }
    /**
     * 
     * @param payload 
     * @returns 
     */
    async assetsOverviewByLimit(payload :string,offset:string,limit:string) : Promise<assetOuput | any>{
        return await assetsDal.assetsOverviewByLimit(payload,offset,limit);
    }
    /**
     * 
     * @param payload 
     * @returns 
     */
    async assetsOverviewByType(payload :string,type:string,offset:string,limit:string) : Promise<assetOuput | any>{
        return await assetsDal.assetsOverviewByType(payload,type,offset,limit);
    }

    /**
     * 
     * @returns 
     */
    async getAssetsList():Promise<assetOuput | any>{
        return await assetsDal.getAssetsList();
    }
    /**
     * 
     * @returns 
     */
    async getAssetsListByLimit(offset:string,limit:string):Promise<assetOuput | any>{
        return await assetsDal.getAssetsListByLimit(offset,limit);
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    async transferHistory(payload :string) : Promise<assetOuput | any>{
        return await assetsDal.getWalletToWalletTransferHistory(payload);
    }

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