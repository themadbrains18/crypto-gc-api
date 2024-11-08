import { Sequelize, Op } from "sequelize";
import networkModel, { networkInput, networkOuput } from "../model/network.model";

class networkDal {
  /**
   * Fetches all network data from the database.
   * 
   * @returns A Promise containing the list of all network entries.
   */
  async all(): Promise<any> {
    return await networkModel.findAll();
  }

  /**
   * Fetches a network record by its ID.
   * 
   * @param payload - The ID of the network record to fetch.
   * @returns A Promise containing the network record, or null if not found.
   */
  async networkById(payload: string): Promise<any> {
    return await networkModel.findOne({ where: { id: payload }, raw: true });
  }


  /**
   * Creates a new network record in the database.
   * 
   * @param payload - The network data to create.
   * @returns A Promise containing the created network record.
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
