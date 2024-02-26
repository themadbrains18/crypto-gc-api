import { Sequelize, Op } from "sequelize";
import networkModel, { networkInput, networkOuput } from "../model/network.model";

class networkDal {
  /**
   * return all tokens data
   * @returns
   */
  async all(): Promise<any> {
    return await networkModel.findAll();
  }

  async networkById(payload: string): Promise<any> {
    return await networkModel.findOne({ where: { id: payload }, raw: true });
  }

  /**
   * create new token
   * @param payload
   * @returns
   */

  async createNetwork(payload: networkInput): Promise<networkOuput> {
    try {
      return await networkModel.create(payload);
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export default new networkDal();
