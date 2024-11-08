import tokensModel, { tokenInput, tokenOuput } from "../model/tokens.model";
import tokenDto from "../dto/token.dto";
import { Sequelize, Op } from "sequelize";
import globalTokensModel from "../model/global_token.model";
import { updatePairStatus, updateTokenStatus } from "../../utils/interface";
import tradePairModel, { tradePairOuput } from "../model/tradePair.model";
import tradePairDto from "../dto/tradePair.dto";

class tradePairDal {

  /**
   * Get all trade pairs.
   * 
   * @returns A Promise that resolves to an array of all trade pairs.
   * @throws Will throw an error if the retrieval process fails.
   */
  async all(): Promise<any> {
    try {
      let trades = await tradePairModel.findAll({ raw: true });
      return trades;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Get a limited set of trade pairs.
   * 
   * @param offset - The starting index for pagination.
   * @param limit - The number of trade pairs to retrieve.
   * 
   * @returns A Promise that resolves to an array of trade pairs within the specified limit and offset.
   * @throws Will throw an error if the retrieval process fails.
   */
  async allByLimit(offset: any, limit: any): Promise<any> {
    try {
      let offsets = parseInt(offset);
      let limits = parseInt(limit);
      let trades = await tradePairModel.findAll({ limit: limits, offset: offsets });
      return trades;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  /**
   * Check if a trade pair with the given ID already exists.
   * 
   * @param payload - The trade pair data, including the ID to check.
   * 
   * @returns A Promise that resolves to the trade pair data if it exists, or `null` if not found.
   * @throws Will throw an error if the retrieval process fails.
   */
  async pairIfExist(payload: tradePairDto): Promise<tradePairOuput | any> {
    try {
      let trades = await tradePairModel.findOne({ where: { id: payload?.id }, raw: true });
      if (trades) {
        return trades;
      }
    } catch (error: any) {
      throw new Error(error?.message);
    }

  }

  /**
   * Create a new trade pair.
   * 
   * @param payload - The trade pair data to create.
   * 
   * @returns A Promise that resolves to the created trade pair object.
   * @throws Will throw an error if the creation process fails.
   */
  async createPair(payload: tradePairDto): Promise<tradePairOuput | any> {
    try {
      return await tradePairModel.create(payload);
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Edit an existing trade pair.
   * 
   * @param payload - The trade pair data to update, including the ID to identify the record.
   * 
   * @returns A Promise that resolves to the number of affected rows or an updated trade pair object.
   * @throws Will throw an error if the update process fails.
   */
  async editPair(payload: tradePairDto): Promise<tradePairOuput | any> {
    try {

      return await tradePairModel.update(payload, { where: { id: payload.id } });

    } catch (error) {
      console.log(error)
    }
  }


  /**
   * Change the status of a trade pair (active/inactive).
   * 
   * @param payload - The data containing the ID of the trade pair to change the status.
   * 
   * @returns A Promise that resolves to the updated status of the trade pair.
   * @throws Will throw an error if the status change process fails.
   */
  async changeStatus(payload: updatePairStatus): Promise<any> {
    try {
      let pair: any = await tradePairModel.findOne({ where: { id: payload?.id } });
      let apiStatus;
      apiStatus = await pair.update({ status: pair?.dataValues?.status == true ? false : true });
      return apiStatus;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new tradePairDal();
