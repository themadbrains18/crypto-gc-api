import { Request, Response } from "express";
import BaseController from "./main.controller";
import adsPostDto from "../models/dto/adspost.dto";
import service from "../services/service";
import WebSocket from 'ws';


class postController extends BaseController {
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
  * 
  * @param res 
  * @param req 
  */
  getBlanceByuserID(req: Request, res: Response) {

  }


  /**
  * 
  * @param res 
  * @param req 
  */
  async create(req: Request, res: Response) {
    try {
      let ads: adsPostDto = req.body;
      let adsReponse = await service.ads.createAds(ads);
      super.ok<any>(res, { message: "Post ads create successfully!!.", result: adsReponse });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
  * 
  * @param res 
  * @param req 
  */
  async getPost(req: Request, res: Response) {
    try {
      let userPost = await service.ads.getUserAds(req?.body?.user_id);

      super.ok<any>(res, userPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
  * 
  * @param res 
  * @param req 
  */
  async getPostByUser(req: Request, res: Response) {
    try {
      let { offset, limit } = req.params;
      let userPost = await service.ads.getUserAdsPost(req?.body?.user_id,offset, limit);

      super.ok<any>(res, userPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
  * 
  * @param res 
  * @param req 
  */
  async getAllAds(req: Request, res: Response) {
    try {
      let {userid, offset, limit } = req.params;
      let allPost = await service.ads.getAllPost(userid,offset, limit);
      super.ok<any>(res, allPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
  * 
  * @param res 
  * @param req 
  */
  async getPostByUserByStatus(req: Request, res: Response) {
    try {
      let {status, offset, limit } = req.params;
      let allPost = await service.ads.getUserPostByStatus(req.body.user_id,status,offset, limit);
      super.ok<any>(res, allPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async getSingleAdsById(req: Request, res: Response) {
    try {
      let post_id = req?.params?.id;
      let user_id = req?.body?.user_id;

      let response = await service.ads.getSinglePostById(post_id,user_id);

      super.ok<any>(res, response);

    } catch (error:any) {
      super.fail(res, error.message);
    }
  }

  /**
  * 
  * @param res 
  * @param req 
  */
  async deletePost(req: Request, res: Response) {
    try {

      let post = await service.ads.deletePost(req.params.postid, req.params.userid);

      super.ok<any>(res, post);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Edit post 
   * @param req 
   * @param res 
   */
  async edit(req: Request, res: Response) {
    try {
      let ads: adsPostDto = req.body;
      let adsReponse = await service.ads.editAds(ads);
      super.ok<any>(res, { message: "Post ads create successfully!!.", result: adsReponse });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Update ads status active or inactive
   */
  async updateStatus(req: Request, res: Response) {
    try {
      let post_id = req?.body?.post_id;
      let user_id = req?.body?.user_id;
      
      let adsReponse = await service.ads.updateAds(post_id, user_id);
      super.ok<any>(res, { message: "Post ads create successfully!!.", result: adsReponse });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
  * 
  * @param res 
  * @param req 
  */
  async socketPostAds(wss: WebSocket.Server, ws: WebSocket,userid: string | undefined, limit: number, offset: number): Promise<void> {
    try {
      const { data, totalLength } = await service.ads.getAllPost(userid,limit, offset);
      wss.clients.forEach(function e(client: any) {
        client.send(JSON.stringify({ status: 200, data: data, type: 'post' }));
      })
    } catch (error) {
      ws.send(JSON.stringify({ status: 500, data: error }))
    }
  }
}

export default postController