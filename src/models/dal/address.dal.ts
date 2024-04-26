import { Sequelize, Op } from "sequelize";
import addressModel, { addressInput, addressOuput } from "../model/address.model";
import networkModel from "../model/network.model";
import tokensModel from "../model/tokens.model";
import globalTokensModel from "../model/global_token.model";

class addressDal {
  /**
   * return all address data
   * @returns
   */
  async all(): Promise<any> {
    return await addressModel.findAll({
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


        ]
    });
  }

  async addressyId(payload: string, offset: string, limit: string): Promise<any> {
    let address = await addressModel.findAll({
      where: { user_id: payload }, include:
        [{
          model: networkModel,
          attributes: {
            exclude: [
              "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
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
      limit: Number(limit),
      offset: Number(offset)
    });
    const totalLength = await addressModel.count({ where: { user_id: payload } });
    return { data: address, totalLength: totalLength };
  }

  /**
   * create new address
   * @param payload
   * @returns
   */

  async createAddress(payload: addressInput): Promise<addressOuput> {
    try {
      return await addressModel.create(payload);
    } catch (error: any) {
      console.log(error, "==error here");

      throw new Error(error.message)
    }
  }

  async changeStatus(payload: addressInput): Promise<any> {
    try {
      let address: any = await addressModel.findOne({ where: { id: payload?.id } });
      let apiStatus;
      apiStatus = await address.update({ status: address?.dataValues?.status == true ? false : true });
      return apiStatus;
    } catch (error: any) {
      throw new Error(error);
    }
  }


  /**
   * Delete ads post
   * @param address_id 
   * @param user_id 
   * @returns 
   */
  async deleteAddressByUserAddressId(address_id: string, user_id: string): Promise<addressOuput | any> {

    try {
      let address = await addressModel.findOne({ where: { id: address_id, user_id: user_id }, raw: true });
      if (address != null) {
        let deleteAddress = await addressModel.destroy({ where: { id: address_id } });
        return deleteAddress;
      }
      else {
        throw new Error('Selected address  not exist. Please verify your address.')
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new addressDal();
