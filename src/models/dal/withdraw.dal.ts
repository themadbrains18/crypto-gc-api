import { Op } from "sequelize";
import { assetsWalletType } from "../../utils/interface";
import withdrawDto from "../dto/withdraw.dto";
import assetModel from "../model/assets.model";
import globalTokensModel from "../model/global_token.model";
import MarketProfitModel, { MarketProfitInput } from "../model/marketProfit.model";
import networkModel from "../model/network.model";
import tokensModel from "../model/tokens.model";
import withdrawModel, { assetOuput } from "../model/withdraw.model";
import tokenDal from "./token.dal";

class withdrawDal {


 /**
   * Creates a new withdrawal request and deducts the amount from the user's main wallet.
   * Also handles fee deduction from the user and adds the fee to the admin's profit.
   * @param payload The withdrawal details including user ID, token ID, amount, and fee.
   * @returns A promise that resolves to the withdrawal response or an error message.
   */
  async createWithdrawRequest(payload: withdrawDto): Promise<assetOuput | any> {
    try {
      let apiResponse;

      let WithdrawResponse = await withdrawModel.create(payload);
      if (WithdrawResponse) {

        let getassets = await assetModel.findOne({ where: { token_id: payload?.tokenID, user_id: payload?.user_id, walletTtype: assetsWalletType.main_wallet }, raw: true });
        if (getassets) {
          let updatebalance = getassets?.balance - payload?.amount;

          let balUpdate = await assetModel.update({ balance: updatebalance }, { where: { id: getassets?.id } });
          if (balUpdate) {
            apiResponse = WithdrawResponse;
          }

          // =========================================================//
          // ================Fee Deduction from user and add to admin=================//
          // =========================================================//
          try {
            let profit: MarketProfitInput = {
              source_id: WithdrawResponse?.dataValues?.id,
              total_usdt: 0,
              paid_usdt: 0,
              admin_usdt: 0,
              buyer: WithdrawResponse?.dataValues?.user_id,
              seller: WithdrawResponse?.dataValues?.user_id,
              profit: 0,
              fees: parseFloat(payload?.fee),
              coin_type: WithdrawResponse?.dataValues?.symbol,
              source_type: 'Withdraw',
            }
            await MarketProfitModel.create(profit);
          } catch (error: any) {
            throw new Error(error.message);
          }
        }
      }
      return apiResponse;
    } catch (error) {
      console.log(error)
    }

  }

  /**
   * Retrieves the list of withdrawal requests for a given user by their ID.
   * @param id The user's ID.
   * @returns A promise that resolves to a list of withdrawal requests.
   */
  withdrawListById = async (id: number | string): Promise<object | null> => {
    try {
      let wallet: any = await withdrawModel.findAll({
        where: { user_id: id },
        attributes: {
          exclude: ['id', 'deletedAt', 'updatedAt']
        },
        order: [["createdAt", "desc"]],
        raw: true
      });
      let data = wallet
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Retrieves a list of all withdrawal requests.
   * @returns A promise that resolves to a list of withdrawal requests.
   */
  async getListOfWithdraw(): Promise<assetOuput[] | any> {
    try {
      return await withdrawModel.findAll({
        include:
          [{
            model: networkModel,
            attributes: {
              exclude: [
                "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
              ]
            }
          },
          {
            model: tokensModel
          },
          {
            model: globalTokensModel
          }
          ],
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves a paginated list of withdrawal requests.
   * @param offset The starting point for the list (pagination).
   * @param limit The number of records to retrieve per page.
   * @returns A promise that resolves to a paginated list of withdrawal requests.
   */
  async getListOfWithdrawByLimit(offset: string, limit: string): Promise<assetOuput[] | any> {
    try {
      let offsets = parseInt(offset);
      let limits = parseInt(limit);
      return await withdrawModel.findAll({
        include:
          [{
            model: networkModel,
            attributes: {
              exclude: [
                "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
              ]
            }
          },
          {
            model: tokensModel
          },
          {
            model: globalTokensModel
          }
          ], limit: limits,
        offset: offsets,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves the withdrawal history for a given user by their ID.
   * @param id The user's ID.
   * @returns A promise that resolves to a list of withdrawal history.
   */
  withdrawHistoryById = async (id: number | string): Promise<object | null> => {
    try {
      let wallet: any = await withdrawModel.findAll({
        where: { user_id: id },
        include:
          [{
            model: networkModel,
            attributes: {
              exclude: [
                "chainId", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
              ]
            }
          },
          {
            model: tokensModel
          },
          {
            model: globalTokensModel
          }
          ],
        order: [["createdAt", "desc"]]
      });
      let data = wallet
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  /**
   * Retrieves the withdrawal history with pagination and optional filters.
   * @param id The user's ID.
   * @param offset The starting point for the list (pagination).
   * @param limit The number of records to retrieve per page.
   * @param currency The currency type to filter the results by.
   * @param date The date to filter the results by.
   * @returns A promise that resolves to a paginated list of withdrawal history with filters applied.
   */
  withdrawHistoryByIdLimit = async (id: number | string, offset: string, limit: string, currency:string, date:string): Promise<object | null> => {
    try {
      let offsets = parseInt(offset)
      let limits = parseInt(limit)
      let whereClause: any = {
        user_id: id
    };
      if (currency && currency !== 'all') {
        whereClause.symbol=currency
    }
    if (date && date !== 'all') {
        whereClause.createdAt = {
            [Op.gte]: new Date(date as string) // Filter posts from the given date
        };
    }
      let wallet: any = await withdrawModel.findAll({
        where: whereClause,
        include:
          [{
            model: networkModel,
            attributes: {
              exclude: [
                "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
              ]
            }
          },
          {
            model: tokensModel
          },
          {
            model: globalTokensModel
          }
          ],
        order: [["createdAt", "desc"]],
     
      });
      let data = wallet
      
      let allData: any = await withdrawModel.findAll({
        where: { user_id: id }, raw: true
      })

      let assests = await tokenDal.adminTokenAll()

      let withdrawTotal = 0.00;

      for (const ls of assests) {
        for (const wl of allData) {
          if (wl.tokenID === ls.id)

            withdrawTotal = withdrawTotal + (parseFloat(wl?.amount) * parseFloat(ls.price));
        }
      }

      
      const totalLength = data.length;
    
      // Paginate the filtered records
      const paginatedData = data.slice(offsets, offsets + limits);

      return { data: paginatedData,total: totalLength, totalAmount: withdrawTotal };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

}

export default new withdrawDal();
