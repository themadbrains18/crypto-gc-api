import { where } from "sequelize";
import adspostDal from "../models/dal/adspost.dal";
import adsPostDto from "../models/dto/adspost.dto";
import postModel, { postOuput } from "../models/model/post.model";

class adsPostservice{

    async createAds(payload : adsPostDto):Promise<postOuput| any>{
        return await adspostDal.create(payload);
    }

    async getUserAdsPost(payload : string,offset:any,limit:any):Promise<postOuput | any>{
        return await adspostDal.getUserAdsPost(payload,offset, limit);
    }

    async getAllPost(offset:any,limit:any):Promise<postOuput | any>{
        return await adspostDal.getAllAdsPost(offset,limit);
    }
    async getUserPostByStatus(payload : string,status:string,offset:any,limit:any):Promise<postOuput | any>{
        return await adspostDal.getUserPostByStatus(payload,status,offset,limit);
    }

    async deletePost(post_id : string, user_id:string):Promise<postOuput |any>{
        return await adspostDal.deletePostByUserPostId(post_id,user_id);
    }

    async getPostByid(post_id:string):Promise<postOuput | any>{
        let post = await postModel.findOne({where : {id : post_id}}).then(data=>{
            return data?.dataValues;
        });
        return post;
    }

    async getSinglePostById(post_id:string, user_id:string):Promise<postOuput | any>{
        return await adspostDal.getSingleAds(post_id, user_id);
    }

    async editAds(payload : adsPostDto):Promise<postOuput| any>{

        let post = await postModel.findOne({where : {id : payload.id}, raw:true});
        if(post){
            let updatePost = await postModel.update(payload,{where: {id : payload?.id}});
            if(updatePost){
                return await postModel.findOne({where : {id : payload.id}, raw:true});
            }
        }
    }

    async updateAds(post_id : string,user_id :string){
        let post = await postModel.findOne({where : {id : post_id}, raw:true});
        if(post){
            // console.log(typeof post?.status,'=========post status');
            // let newStatus:any = post?.status === 1 ? false : true;
            let updatePost = await postModel.update({status : !post.status},{where: {id : post_id, user_id : user_id}});
            if(updatePost){
                return await adspostDal.getSingleAds(post_id, user_id);
            }
        }
    }
}

export default adsPostservice;