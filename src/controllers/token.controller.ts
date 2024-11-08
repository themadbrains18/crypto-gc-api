import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import { CustomError } from "../exceptions/http-exception";
import service from "../services/service";
import { tokenInput } from "../models/model/tokens.model";
import tokenDto from "../models/dto/token.dto";
import { any } from "joi";
import { log } from "console";
import { updateTokenNetwork, updateTokenStakeStatus, updateTokenStatus } from "../utils/interface";
import { globalTokensModel } from "../models";

class tokenController extends BaseController {
  protected async executeImpl(
    req: Request,
    res: Response
  ): Promise<void | any> {
    try {
      // ... Handle request by creating objects
    } catch (error: any) {
      return this.fail(res, error.toString());
    }
  }
  /**
   * Fetches all tokens.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */

  async tokenAll(req: Request, res: Response, next: NextFunction) {
    try {
      let tokens = await service.token.all();

      super.ok<any>(res, tokens);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Fetches all future tokens.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async futureTokenAll(req: Request, res: Response, next: NextFunction) {
    try {
      let tokens = await service.token.futureAll();

      super.ok<any>(res, tokens);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Fetches all tokens with pagination limit.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async tokenAllWithLimit(req: Request, res: Response, next: NextFunction) {
    try {
      let { offset, limit } = req.params;

      // const pageInt = parseInt(page);
      // const limitInt = parseInt(limit);
      let tokens = await service.token.adminTokenAll();
      let paginatedData = await service.token.allWithLimit(offset, limit);

      // const offset = (pageInt - 1) * limitInt;
      // const paginatedData = tokens.slice(pageInt,limitInt);

      // console.log(paginatedData, "===jdjlskj");

      super.ok<any>(res, { data: paginatedData, total: tokens.length });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   *
   * @param res
   * @param req
   */
  socketGetCoinList(req: Request, res: Response) { }

  /**
   * Create a new token.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // const obj = JSON.parse(JSON.stringify(req.files));
      // for (let itm in obj) {
      //   req.body[itm] =
      //     "http://localhost:3000/tmbexchange/token/" + obj[itm][0]?.filename;
      // }

      let token: tokenDto = req.body;
      //=======================================//
      // check token if already register
      //=======================================//
      let tokenConntractAlreadyRegister = await service.token.alreadyExist(
        token
      );
      let flag = false;

      if (tokenConntractAlreadyRegister.length > 0) {
        return super.fail(res, "Token contarct already registered.");
      }
      
      let tokenResponse = await service.token.create(token);
      super.ok<any>(res, {
        message: "Token successfully registered.",
        result: tokenResponse,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // ===================================================================
  // Admin service api
  // ===================================================================


  /**
   * Change the active status of a token.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async activeInactiveToken(req: Request, res: Response, next: NextFunction) {
    try {
      let { id, status } = req.body;

      let data: updateTokenStatus = { id, status };

      let statusResponse = await service.token.changeStatus(data);
      if (statusResponse) {
        let tokens = await service.token.adminTokenAll();
        return super.ok<any>(res, tokens);
      } else {
        super.fail(res, statusResponse);
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Change the stake status of a token.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async stakeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let { id, status } = req.body;

      let data: updateTokenStakeStatus = { id, status };

      let statusResponse = await service.token.changeStakeStatus(data);
      if (statusResponse) {
        let tokens = await service.token.adminTokenAll();
        return super.ok<any>(res, tokens);
      } else {
        super.fail(res, statusResponse);
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
   * Get all tokens for admin.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async adminTokenAll(req: Request, res: Response, next: NextFunction) {
    try {
      let tokens = await service.token.adminTokenAll();
      super.ok<any>(res, tokens);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Edit an existing token.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      // const obj = JSON.parse(JSON.stringify(req.files));
      // for (let itm in obj) {
      //   req.body[itm] =
      //     "http://localhost:3000/tmbexchange/token/" + obj[itm][0]?.filename;
      // }

      let token: tokenDto = req.body;

      //=======================================//
      // check token if already register
      //=======================================//
      let tokenConntractAlreadyRegister = await service.token.alreadyExist(
        token
      );
      let flag = false;

      if (tokenConntractAlreadyRegister.length > 0) {
        let tokenResponse = await service.token.edit(token);
        if (tokenResponse) {
          let tokens = await service.token.adminTokenAll();
          return super.ok<any>(res, tokens);
        }
        // super.ok<any>(res, { message: "Token successfully registered.", data: tokenResponse })
      } else {
        return super.fail(
          res,
          "Token contarct not registered. Please add new token."
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  /**
   * Update token's network.
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function for error handling
   */
  async updateNetwork(req: Request, res: Response, next: NextFunction) {
    try {

      let token = await globalTokensModel.findOne({ where: { id: req.body?.id }, raw: true });
      
      if (token) {
        req.body.networks = JSON.parse(req.body.networks);
        let body: updateTokenNetwork = req.body;
        let updateResponse = await service.token.updateGlobalTokenNetwork(body);

        super.ok<any>(res, updateResponse);
      }
      else {
        super.fail(res, 'Token not found');
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
}

export default tokenController;
