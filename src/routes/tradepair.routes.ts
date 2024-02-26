import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import tokenSchema from "../validators/token.validator";
import service from "../services/service";
import tradePairController from "../controllers/tradepair.controller";
import tradePairSchema from "../validators/tradepair.validator";


class tradePairRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let tradePair = new tradePairController();
        let auth = new authController().auth;
        let middleware = new authController();
        // ===============================================
        // Frontend client routes
        // ===============================================

        // this.router.get('/', tradePair.allPairs); 
        this.router.get('/:offset/:limit', middleware.auth, tradePair.allPairsByLimit);

        /**
         * Trade Pair listed by user from frontend 
        **/
        this.router.post('/create', middleware.auth, super.Validator(tradePairSchema.create), tradePair.create);

        /**
        * Top gainer token list
        */
        // this.router.get('/topgainer', tone_list.topGainerList);


        // ===============================================
        // Admin routes
        // ===============================================

        // this.router.get('/list/all', tokens.adminTokenAll);

        /**
         * Listed token edit by admin in dashboard 
        **/

        this.router.post('/edit', middleware.auth, super.Validator(tradePairSchema.edit), tradePair.edit);

        /**
         * Admin active/Inactive token that show on frontend
         */
        this.router.put('/change/status', middleware.auth, tradePair.activeInactivePair);

        /**
         *  New token listed by admin 
         */
        // this.router.post('/token_list/create', auth, service.upload.upload("token", ['jpg', 'png'], 2, [
        //     {
        //         name: "logo",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenListingSchema.create), tone_list.create);

        /**
         * //get admin listed token list
         */
        // this.router.get('/list', tone_list.tokenList);




    }
}

export default new tradePairRoutes().router;