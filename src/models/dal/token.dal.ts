import tokensModel, { tokenInput, tokenOuput } from "../model/tokens.model";
import tokenDto from "../dto/token.dto";
import { Sequelize, Op, Model } from "sequelize";
import globalTokensModel from "../model/global_token.model";
import {
  updateTokenNetwork,
  updateTokenStakeStatus,
  updateTokenStatus,
} from "../../utils/interface";
import tokenstakeModel from "../model/tokenstake.model";
import { Database, futureTradePairModel } from "../index";

import tradePairModel from "../model/tradePair.model";
import MarketProfitModel, { MarketProfitInput } from "../model/marketProfit.model";

class tokenDal {
  /**
   * return all tokens data
   * @returns
   */
  async all(): Promise<any> {
    let tokens = await tokensModel.findAll({
      where: { status: true },
      include: [
        {
          model: tokenstakeModel,
        },
        {
          model: tradePairModel
        }
      ],
    });
    let globalTokens = await globalTokensModel.findAll({
      where: { status: true },
      include: [
        {
          model: tokenstakeModel,
        },
        {
          model: tradePairModel
        }
      ],
      order: [["rank", "ASC"]],
    });

    let allTokens = tokens.concat(globalTokens);
    return allTokens;
  }

  async futureAll(): Promise<any> {
    let tokens = await tokensModel.findAll({
      where: { status: true },
      include: [
        {
          model: tokenstakeModel,
        },
        {
          model: tradePairModel
        },
        {
          model: futureTradePairModel
        }
      ],
    });
    let globalTokens = await globalTokensModel.findAll({
      where: { status: true },
      include: [
        {
          model: tokenstakeModel,
        },
        {
          model: tradePairModel
        },
        {
          model: futureTradePairModel
        }
      ],
      order: [["rank", "ASC"]],
    });

    let allTokens = tokens.concat(globalTokens);
    return allTokens;
  }

  /**
   * return all tokens data
   * @returns
   */
  async allWithLimit(offset: any, limit: any): Promise<any> {
    let offsets = parseInt(offset);
    let limits = parseInt(limit);



    let tokens = await tokensModel.findAll({
      include: [
        {
          model: tokenstakeModel,
        },
      ],
      limit: limits,
      offset: offsets,
    });

    if (tokens.length > 0 && tokens.length < limits) {
      limits = limits - tokens.length;
      offsets = 0;
    }
    else if (tokens.length >= limits) {
      offsets = offsets;
    }
    else {
      let TokensLimit = await tokensModel.findAll();
      offsets = offsets - TokensLimit.length;
    }

    let globalTokens = await globalTokensModel.findAll({
      include: [
        {
          model: tokenstakeModel,
        },
      ],
      order: [["rank", "ASC"]],
      limit: limits,
      offset: offsets,
    });

    let allTokens = tokens.concat(globalTokens).slice(0, 10);

    return allTokens;
  }

  /**
   *
   * @param payload if contract already register
   * @returns
   */
  async contarctIfExist(payload: tokenDto): Promise<tokenOuput | any> {
    let contractList = [];
    if (payload?.networks != undefined && payload?.networks.length > 0) {
      for (let item of payload?.networks) {
        if (item.hasOwnProperty("contract")) {
          contractList.push(item.contract);
        }
      }
    }

    //  if token is already register then trigger error
    if (contractList.length > 0) {
      let condition = contractList.map((item) =>
        Sequelize.where(
          Sequelize.col("networks"), // Just 'name' also works if no joins
          Op.like,
          `%${item}%`
        )
      );
      let data = await tokensModel.findAll({
        where: {
          [Op.or]: condition,
        },
        raw: true,
      });
      return data;
    }

    return [];
  }

  /**
   * create new token
   * @param payload
   * @returns
   */

  async createToken(payload: tokenDto): Promise<tokenOuput | any> {
    try {
      let created = await tokensModel.create(payload);
      if (created) {
        try {
          let profit: MarketProfitInput = {
            source_id: created?.dataValues?.id,
            total_usdt: 0,
            paid_usdt: 0,
            admin_usdt: 0,
            buyer: '',
            seller: '',
            profit: 0,
            fees: 0,
            coin_type: 'USDT',
            source_type: 'Token Listing',
            listing_fee: payload?.fees,
          }
          await MarketProfitModel.create(profit);

          return created;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async editToken(payload: tokenDto): Promise<tokenOuput | any> {
    try {
      if (payload.image === "") {
        delete payload.image;
      }
      return await tokensModel.update(payload, { where: { id: payload.id } });
    } catch (error) {
      console.log(error);
    }
  }

  // ==========================================
  // Admin APi
  // ==========================================

  async adminTokenAll(): Promise<any> {
    let tokens = await tokensModel.findAll({
      include: [
        {
          model: tokenstakeModel,
        },
      ],
      raw: true
    });
    let globalTokens = await globalTokensModel.findAll({
      include: [
        {
          model: tokenstakeModel,
        },
      ],
      order: [["rank", "ASC"]],
      raw: true
    });

    let allTokens = tokens.concat(globalTokens);
    return allTokens;
  }

  async changeStatus(payload: updateTokenStatus): Promise<any> {
    try {

      let global_token: any = await globalTokensModel.findOne({
        where: { id: payload?.id }, raw: true
      });
      let token: any = await tokensModel.findOne({
        where: { id: payload?.id }, raw: true
      });
      let apiStatus;
      if (token) {
        apiStatus = await tokensModel.update({
          status: (token?.status === true || token?.status === 1) ? false : true,
        },{where :{id : payload?.id}});
      } else if (global_token) {
        apiStatus = await globalTokensModel.update({
          status: (global_token?.status === true || global_token?.status === 1) ? false : true,
        },{where :{id : payload?.id}});
      }
      return apiStatus;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async changeStakeStatus(payload: updateTokenStakeStatus): Promise<any> {
    try {
      let tokenStake: any = await tokenstakeModel.findOne({
        where: { id: payload?.id },
      });
      let apiStatus;
      if (tokenStake) {
        apiStatus = await tokenStake.update({
          status: tokenStake?.dataValues?.status === true ? false : true,
        });
      }
      return apiStatus;
    } catch (error: any) {
      throw new Error(error);
    }
  }


  async getSingleToken(contractAddress: string): Promise<tokenOuput | null> {
    try {
      let condition = Database.where(
        Database.col('networks'), // Just 'name' also works if no joins
        Op.like,
        `%${contractAddress}%`
      );
      let token = await tokensModel.findOne({
        where: {
          [Op.or]: condition
        },
        raw: true
      })
      return token
    } catch (error: any) {
      throw new Error(error)
    }
  }


  async updateNetwork(payload: updateTokenNetwork): Promise<any> {
    try {
      let response = await globalTokensModel.update({ networks: payload.networks }, { where: { id: payload?.id } });
      if (response[0] === 1) {
        console.log('here update successfully!!');
        return await globalTokensModel.findOne({ where: { id: payload?.id }, raw: true });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

}

export default new tokenDal();
