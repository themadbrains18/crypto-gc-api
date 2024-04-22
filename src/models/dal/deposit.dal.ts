import assetModel from "../model/assets.model";
import depositModel, { depositOuput } from "../model/deposit.model";
import globalTokensModel from "../model/global_token.model";
import tokensModel from "../model/tokens.model";
import tokenDal from "./token.dal";

class depositDal {

  /**
   * create new withdraw request
   * @param payload
   * @returns
   */




  async getListOfDepositById(id: string): Promise<depositOuput[] | any> {
    try {
      let deposit: any = await depositModel.findAll({
        where: { user_id: id },
        attributes: {
          exclude: ['id', 'deletedAt', 'updatedAt']
        },
        order: [["createdAt", "desc"]],
        raw: true
      });
      let data = deposit
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getListOfDeposit(): Promise<depositOuput[] | any> {
    try {
      return await depositModel.findAll();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getDepositListByLimit(offset: any, limit: any): Promise<depositOuput[] | any> {
    try {

      let offsets = parseInt(offset);
      let limits = parseInt(limit)

      return await depositModel.findAll({
        limit: limits,
        offset: offsets
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getHistoryOfDepositById(id: string): Promise<depositOuput[] | any> {
    try {

      let deposit: any = await depositModel.findAll({
        where: { user_id: id },
        attributes: {
          exclude: ['id', 'deletedAt', 'updatedAt']
        },
        include: [
          {
            model: tokensModel
          },
          {
            model: globalTokensModel
          }
        ],
        order: [["createdAt", "desc"]],
      });
      let data = deposit
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getHistoryOfDepositByIdLimit(id: string, offset: string, limit: string): Promise<depositOuput[] | any> {
    try {
      let offsets = parseInt(offset)
      let limits = parseInt(limit)
      let deposit: any = await depositModel.findAll({
        where: { user_id: id },
        attributes: {
          exclude: ['id', 'deletedAt', 'updatedAt']
        },
        include: [
          {
            model: tokensModel
          },
          {
            model: globalTokensModel
          }
        ],
        order: [["createdAt", "desc"]],
        raw: true,
        offset: offsets,
        limit: limits
      });

     let allData= await depositModel.findAll({
        where: { user_id: id },
      raw:true})
      let assests = await tokenDal.adminTokenAll()

      let depositTotal = 0.00;

      for (const ls of assests) {
        for (const dl of allData) {
          if (dl.coinName.split('/')[1] === ls.symbol)
            depositTotal = depositTotal + (parseFloat(dl.amount) * parseFloat(ls.price));
        }
      }

      let data = deposit
      return {data:data, totalAmount:depositTotal};
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

}

export default new depositDal();
