"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adspost_dal_1 = __importDefault(require("../models/dal/adspost.dal"));
const post_model_1 = __importDefault(require("../models/model/post.model"));
class adsPostservice {
    async createAds(payload) {
        return await adspost_dal_1.default.create(payload);
    }
    async getUserAdsPost(payload) {
        return await adspost_dal_1.default.getUserAdsPost(payload);
    }
    async getAllPost() {
        return await adspost_dal_1.default.getAllAdsPost();
    }
    async deletePost(post_id, user_id) {
        return await adspost_dal_1.default.deletePostByUserPostId(post_id, user_id);
    }
    async getPostByid(post_id) {
        let post = await post_model_1.default.findOne({ where: { id: post_id } }).then(data => {
            return data?.dataValues;
        });
        return post;
    }
    async getSinglePostById(post_id, user_id) {
        return await adspost_dal_1.default.getSingleAds(post_id, user_id);
    }
    async editAds(payload) {
        let post = await post_model_1.default.findOne({ where: { id: payload.id }, raw: true });
        if (post) {
            let updatePost = await post_model_1.default.update(payload, { where: { id: payload?.id } });
            if (updatePost) {
                return await post_model_1.default.findOne({ where: { id: payload.id }, raw: true });
            }
        }
    }
    async updateAds(post_id, user_id) {
        let post = await post_model_1.default.findOne({ where: { id: post_id }, raw: true });
        if (post) {
            // console.log(typeof post?.status,'=========post status');
            // let newStatus:any = post?.status === 1 ? false : true;
            let updatePost = await post_model_1.default.update({ status: !post.status }, { where: { id: post_id, user_id: user_id } });
            if (updatePost) {
                return await adspost_dal_1.default.getSingleAds(post_id, user_id);
            }
        }
    }
}
exports.default = adsPostservice;
