import { Sequelize, Op } from "sequelize";
import addressModel, { addressInput, addressOuput } from "../model/address.model";
import networkModel from "../model/network.model";
import tokensModel from "../model/tokens.model";
import globalTokensModel from "../model/global_token.model";
import sequelize from "..";

class addressDal {
 /**
   * Return all address data, including related network, tokens, and global tokens.
   * @returns A list of address data with associated models.
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
  /**
   * Get addresses by user ID with pagination.
   * @param userId - The user ID to filter addresses.
   * @param offset - The offset for pagination.
   * @param limit - The limit for pagination.
   * @returns Paginated list of addresses along with the total count.
   */
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
   * Create a new address.
   * @param payload - The address data to be created.
   * @returns The created address.
   */
  async createAddress(payload: addressInput): Promise<addressOuput> {
    try {
      return await addressModel.create(payload);
    } catch (error: any) {
      // console.log(error, "==error here");  

      throw new Error(error.message)
    }
    
  }

  /**
   * Change the status of an address (toggle between active/inactive).
   * @param payload - The address data including ID to update.
   * @returns The updated address with toggled status.
   */
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
   * Delete an address by user and address ID.
   * @param addressId - The address ID to delete.
   * @param userId - The user ID to verify ownership.
   * @returns The deletion status.
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
