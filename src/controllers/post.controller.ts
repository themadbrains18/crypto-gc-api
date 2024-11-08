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
   * Create a new advertisement post.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves when the ad post is created.
   */
  async create(req: Request, res: Response) {
    try {
      let ads: adsPostDto = req.body;

      // console.log(ads, '----------body data');

      let adsReponse = await service.ads.createAds(ads);
      super.ok<any>(res, { message: "Post ads create successfully!!.", result: adsReponse });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Get all posts from a specific user by user ID.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves with the user's posts.
   */
  async getPost(req: Request, res: Response) {
    try {

      
      let { userid }= req?.params
      let userPost = await service.ads.getUserAds(userid);

      super.ok<any>(res, userPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * Get posts by a user with pagination and limit.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves with the user's posts.
   */
  async getPostByUser(req: Request, res: Response) {
    try {
      let { offset, limit } = req.params;
      let userPost = await service.ads.getUserAdsPost(req?.body?.user_id, offset, limit);

      super.ok<any>(res, userPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Get all advertisements with optional filters.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves with the advertisement posts.
   */
  async getAllAds(req: Request, res: Response) {
    try {
      let { userid, offset, limit, currency,pmMethod } = req.params;
      let allPost = await service.ads.getAllPost(userid, offset, limit,currency,pmMethod);
      super.ok<any>(res, allPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Get posts by user with specific status and filters.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves with the filtered posts.
   */
  async getPostByUserByStatus(req: Request, res: Response) {
    try {
     
      let { status, offset, limit,currency,pmMethod ,date } = req.params;
      let allPost = await service.ads.getUserPostByStatus(req.body.user_id, status, offset, limit,currency,pmMethod ,date);
      super.ok<any>(res, allPost);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

    /**
   * Get a single post by its ID.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves with the post data.
   */
  async getSingleAdsById(req: Request, res: Response) {
    try {
      let post_id = req?.params?.id;
      let user_id = req?.body?.user_id;

      let response = await service.ads.getSinglePostById(post_id, user_id);

      super.ok<any>(res, response);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Delete a post by its ID and user ID.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves when the post is deleted.
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
   * Edit an advertisement post.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves when the post is updated.
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
   * Update the status of a post to active or inactive.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves when the status is updated.
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
   * Send all post ads data to connected WebSocket clients.
   * @param wss - The WebSocket server.
   * @param ws - The WebSocket client.
   * @param userid - The user ID.
   * @param limit - The limit for pagination.
   * @param offset - The offset for pagination.
   * @param currency - The currency for filtering.
   * @param pmMethod - The payment method for filtering.
   * @returns {Promise<void>} A promise that resolves when data is sent to the client.
   */
  async socketPostAds(wss: WebSocket.Server, ws: WebSocket, userid: string | undefined, limit: number, offset: number,currency:string,pmMethod:string): Promise<void> {
    try {
      const { data, totalLength } = await service.ads.getAllPost(userid, limit, offset, currency,pmMethod);
      wss.clients.forEach(function e(client: any) {
        client.send(JSON.stringify({ status: 200, data: data, type: 'post' }));
      })
    } catch (error) {
      ws.send(JSON.stringify({ status: 500, data: error }))
    }
  }

  /**
   * Get the total number of orders made by a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {Promise<void>} A promise that resolves with the total orders.
   */  
  async getTotalOrdersByUser(req: Request, res: Response) {
    try {
      // console.log('-=============',req.params.userid);
      
      let orderResponse = await service.ads.getTotalOrdersByUser(req.params.userid);
      super.ok<any>(res, orderResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
}

export default postController