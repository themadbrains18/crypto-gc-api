import { Sequelize, Op } from "sequelize";
import addressModel, { addressInput, addressOuput } from "../model/address.model";
import networkModel from "../model/network.model";

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
        }]
    });
  }

  async addressyId(payload: string): Promise<any> {
    return await addressModel.findAll({ where: { user_id: payload }, include:
      [{
        model: networkModel,
        attributes: {
          exclude: [
            "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
          ]
        }
      }] });
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
}

export default new addressDal();
