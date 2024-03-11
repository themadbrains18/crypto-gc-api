import { Application, Router } from "express";
import authController from "../middlewares/authController";
import tokenController from "../controllers/token.controller";
import BaseController from "../controllers/main.controller";
import tokenSchema from "../validators/token.validator";
import tokenListingController from "../controllers/token_listing.controller";
import tokenListingSchema from "../validators/tokenlist.validator";
import service from "../services/service";


class tokenRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let tokens = new tokenController();
        let tone_list = new tokenListingController();
        let auth = new authController().auth;

        // ===============================================
        // Frontend client routes
        // ===============================================

        this.router.get('/', tokens.tokenAll);

        this.router.get('/future', tokens.futureTokenAll);

        /**
         * Token listed by user from frontend 
        **/
        // this.router.post('/create', auth, service.upload.upload("token", ['jpg', 'png', 'svg'], 2, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenSchema.create), tokens.create);
        this.router.post('/create', auth, super.Validator(tokenSchema.create), tokens.create);
        /**
        * Top gainer token list
        */
        this.router.get('/topgainer', tone_list.topGainerList);


        // ===============================================
        // Admin routes
        // ===============================================

        this.router.get('/list/all', tokens.adminTokenAll);

        /**
         * get token list using offset and page limit
         */
        this.router.get('/all/:offset/:limit', auth, tokens.tokenAllWithLimit);

        /**
         * Listed token edit by admin in dashboard 
        **/
        // this.router.post('/edit', auth, service.upload.upload("token", ['jpg', 'png', 'svg'], 2, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenSchema.edit), tokens.edit);
        this.router.post('/edit', auth, super.Validator(tokenSchema.edit), tokens.edit);

        /**
         * Admin active/Inactive token that show on frontend
         */
        this.router.put('/change/status', auth, tokens.activeInactiveToken);

        /**
         * Admin enable/disable stake status
         */
        this.router.put('/stake/status', auth, tokens.stakeStatus)

        /**
         *  New token listed by admin 
         */
        this.router.post('/token_list/create', auth, service.upload.upload("token", ['jpg', 'png'], 2, [
            {
                name: "logo",
                maxCount: 1,
            },
        ]), super.Validator(tokenListingSchema.create), tone_list.create);

        /**
         * //get admin listed token list
         */
        this.router.get('/list', tone_list.tokenList);

        /**
         * Add global token network/chain 
         */

        this.router.post('/update/network', auth, tokens.updateNetwork);


    }
}

export default new tokenRoutes().router;