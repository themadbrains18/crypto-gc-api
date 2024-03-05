"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class postController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
    *
    * @param res
    * @param req
    */
    getBlanceByuserID(req, res) {
    }
    /**
    *
    * @param res
    * @param req
    */
    async create(req, res) {
        try {
            let ads = req.body;
            let adsReponse = await service_1.default.ads.createAds(ads);
            super.ok(res, { message: "Post ads create successfully!!.", result: adsReponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    * @param res
    * @param req
    */
    async getPostByUser(req, res) {
        try {
            let userPost = await service_1.default.ads.getUserAdsPost(req?.body?.user_id);
            super.ok(res, userPost);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    * @param res
    * @param req
    */
    async getAllAds(req, res) {
        try {
            let allPost = await service_1.default.ads.getAllPost();
            super.ok(res, allPost);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getSingleAdsById(req, res) {
        try {
            let post_id = req?.params?.id;
            let user_id = req?.body?.user_id;
            let response = await service_1.default.ads.getSinglePostById(post_id, user_id);
            super.ok(res, response);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    * @param res
    * @param req
    */
    async deletePost(req, res) {
        try {
            let post = await service_1.default.ads.deletePost(req.params.postid, req.params.userid);
            super.ok(res, post);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * Edit post
     * @param req
     * @param res
     */
    async edit(req, res) {
        try {
            let ads = req.body;
            let adsReponse = await service_1.default.ads.editAds(ads);
            super.ok(res, { message: "Post ads create successfully!!.", result: adsReponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * Update ads status active or inactive
     */
    async updateStatus(req, res) {
        try {
            let post_id = req?.body?.post_id;
            let user_id = req?.body?.user_id;
            let adsReponse = await service_1.default.ads.updateAds(post_id, user_id);
            super.ok(res, { message: "Post ads create successfully!!.", result: adsReponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    * @param res
    * @param req
    */
    async socketPostAds(wss, ws) {
        try {
            let data = await service_1.default.ads.getAllPost();
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, data: data, type: 'post' }));
            });
        }
        catch (error) {
            ws.send(JSON.stringify({ status: 500, data: error }));
        }
    }
}
exports.default = postController;
