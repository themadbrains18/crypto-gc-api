import { Transaction, where } from "sequelize";
import adspostDal from "../models/dal/adspost.dal";
import adsPostDto from "../models/dto/adspost.dto";
import postModel, { postOuput } from "../models/model/post.model";
import { assetModel } from "../models";
import { assetsWalletType } from "../utils/interface";
import { truncateToSixDecimals } from "../models/dal/p2porder.dal";

class adsPostservice {


    /**
     * Creates a new ad post.
     * @param payload - The ad post data.
     * @returns - The created ad post.
     */
    async createAds(payload: adsPostDto): Promise<postOuput | any> {
        return await adspostDal.create(payload);
    }

    /**
     * Retrieves ads posted by a user.
     * @param userId - The ID of the user whose ads are to be fetched.
     * @returns - List of ads posted by the user.
     */
    async getUserAds(payload: string): Promise<postOuput | any> {
        return await adspostDal.getUserAds(payload);
    }

    /**
     * Retrieves paginated ads posted by a user.
     * @param userId - The ID of the user whose ads are to be fetched.
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @returns - Paginated list of ads posted by the user.
     */
    async getUserAdsPost(payload: string, offset: any, limit: any): Promise<postOuput | any> {
        return await adspostDal.getUserAdsPost(payload, offset, limit);
    }

    /**
     * Retrieves all posts based on various filters.
     * @param userId - The user ID (optional for all users).
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @param currency - The currency filter.
     * @param pmMethod - The payment method filter.
     * @returns - A list of all posts with the given filters.
     */
    async getAllPost(userid: string | undefined, offset: any, limit: any, currency: string, pmMethod: string): Promise<postOuput | any> {
        return await adspostDal.getAllAdsPost(userid, offset, limit, currency, pmMethod);
    }

    /**
     * Retrieves posts by their status.
     * @param userId - The user ID.
     * @param status - The status of the post.
     * @param offset - The offset for pagination.
     * @param limit - The limit for pagination.
     * @param currency - The currency filter.
     * @param pmMethod - The payment method filter.
     * @param date - The date filter for posts.
     * @returns - A list of posts with the specified status and filters.
     */
    async getUserPostByStatus(payload: string, status: string, offset: any, limit: any, currency: string, pmMethod: string, date: string): Promise<postOuput | any> {
        return await adspostDal.getUserPostByStatus(payload, status, offset, limit, currency, pmMethod, date);
    }

    /**
     * Deletes a user's post by post ID.
     * @param postId - The post ID.
     * @param userId - The user ID of the poster.
     * @returns - The result of the delete operation.
     */
    async deletePost(post_id: string, user_id: string): Promise<postOuput | any> {
        return await adspostDal.deletePostByUserPostId(post_id, user_id);
    }

    /**
     * Retrieves a post by its ID, with optional transaction.
     * @param postId - The ID of the post to retrieve.
     * @param t - An optional transaction object.
     * @returns - The retrieved post.
     */
    async getPostByid(post_id: string, t?: Transaction): Promise<postOuput | any> {
        let post = await postModel.findOne({ where: { id: post_id }, transaction: t }).then(data => {
            return data?.dataValues;
        });
        return post;
    }

    /**
     * Retrieves a single post by ID and user ID.
     * @param postId - The ID of the post.
     * @param userId - The user ID of the poster.
     * @returns - The post data.
     */
    async getSinglePostById(post_id: string, user_id: string): Promise<postOuput | any> {
        return await adspostDal.getSingleAds(post_id, user_id);
    }
    /**
     * Edits an ad post.
     * @param payload - The new data for the ad post.
     * @returns - The updated ad post.
     */
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

        /**
     * Toggles the status of an ad post.
     * @param postId - The ID of the post.
     * @param userId - The user ID of the poster.
     * @returns - The updated post.
     */
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


    /**
     * Retrieves the total number of orders by a user.
     * @param userId - The ID of the user.
     * @returns - The total number of orders for the user.
     */
    async getTotalOrdersByUser(user_id: string) {
        return await adspostDal.getTotalOrdersByUser(user_id);
    }
}

export default adsPostservice;