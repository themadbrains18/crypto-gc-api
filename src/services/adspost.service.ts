import { Transaction, where } from "sequelize";
import adspostDal from "../models/dal/adspost.dal";
import adsPostDto from "../models/dto/adspost.dto";
import postModel, { postOuput } from "../models/model/post.model";
import { assetModel } from "../models";
import { assetsWalletType } from "../utils/interface";
import { truncateToSixDecimals } from "../models/dal/p2porder.dal";

class adsPostservice {

    async createAds(payload: adsPostDto): Promise<postOuput | any> {
        return await adspostDal.create(payload);
    }

    async getUserAds(payload: string): Promise<postOuput | any> {
        return await adspostDal.getUserAds(payload);
    }
    async getUserAdsPost(payload: string, offset: any, limit: any): Promise<postOuput | any> {
        return await adspostDal.getUserAdsPost(payload, offset, limit);
    }

    async getAllPost(userid: string | undefined, offset: any, limit: any, currency: string, pmMethod: string): Promise<postOuput | any> {
        return await adspostDal.getAllAdsPost(userid, offset, limit, currency, pmMethod);
    }
    async getUserPostByStatus(payload: string, status: string, offset: any, limit: any, currency: string, pmMethod: string, date: string): Promise<postOuput | any> {
        return await adspostDal.getUserPostByStatus(payload, status, offset, limit, currency, pmMethod, date);
    }

    async deletePost(post_id: string, user_id: string): Promise<postOuput | any> {
        return await adspostDal.deletePostByUserPostId(post_id, user_id);
    }

    async getPostByid(post_id: string, t?: Transaction): Promise<postOuput | any> {
        let post = await postModel.findOne({ where: { id: post_id }, transaction: t }).then(data => {
            return data?.dataValues;
        });
        return post;
    }

    async getSinglePostById(post_id: string, user_id: string): Promise<postOuput | any> {
        return await adspostDal.getSingleAds(post_id, user_id);
    }

    async editAds(payload: adsPostDto): Promise<postOuput | any> {

        let post = await postModel.findOne({ where: { id: payload.id }, raw: true });
        let userAssets: any = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: assetsWalletType.main_wallet }, raw: true });

        if (post) {
            payload.quantity = truncateToSixDecimals(Number(payload.quantity))

            let updatePost = await postModel.update(payload, { where: { id: payload?.id } });
            if (updatePost) {

                // console.log(userAssets?.balance, "balance");
                // console.log(post, "balance");
                // console.log(payload, "balance");


                let newBal = (userAssets?.balance + Number(post.quantity)) - payload.quantity;

                await assetModel.update({ balance: newBal }, { where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: assetsWalletType.main_wallet } });
                return await postModel.findOne({ where: { id: payload.id }, raw: true });
            }
        }
    }

    async updateAds(post_id: string, user_id: string) {
        let post = await postModel.findOne({ where: { id: post_id }, raw: true });
        if (post) {
            // console.log(typeof post?.status,'=========post status');
            // let newStatus:any = post?.status === 1 ? false : true;
            let updatePost = await postModel.update({ status: !post.status }, { where: { id: post_id, user_id: user_id } });
            if (updatePost) {
                return await adspostDal.getSingleAds(post_id, user_id);
            }
        }
    }

    async getTotalOrdersByUser(user_id: string) {
        return await adspostDal.getTotalOrdersByUser(user_id);
    }
}

export default adsPostservice;