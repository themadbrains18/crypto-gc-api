import tokensModel, { tokenInput, tokenOuput } from "../model/tokens.model";
import tokenDto from "../dto/token.dto";
import { Sequelize, Op } from "sequelize";
import globalTokensModel from "../model/global_token.model";
import { updatePairStatus, updateTokenStatus } from "../../utils/interface";
import tradePairModel, { tradePairOuput } from "../model/tradePair.model";
import tradePairDto from "../dto/tradePair.dto";

class tradePairDal {

  /**
   * return all tokens data
   * @returns
   */
  async all(): Promise<any> {
    try {
      let trades = await tradePairModel.findAll({ raw: true });
      return trades;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
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
   * 
   * @param payload if contract already register
   * @returns 
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
   * create new token
   * @param payload
   * @returns
   */

  async createPair(payload: tradePairDto): Promise<tradePairOuput | any> {
    try {
      return await tradePairModel.create(payload);
    } catch (error) {
      console.log(error)
    }
  }

  async editPair(payload: tradePairDto): Promise<tradePairOuput | any> {
    try {

      return await tradePairModel.update(payload, { where: { id: payload.id } });

    } catch (error) {
      console.log(error)
    }
  }


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
