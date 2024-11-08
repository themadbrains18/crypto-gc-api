import { Application, Router } from "express";
import authController from "../middlewares/authController";
import tokenController from "../controllers/token.controller";
import BaseController from "../controllers/main.controller";
import tokenSchema from "../validators/token.validator";
import tokenListingController from "../controllers/token_listing.controller";
import tokenListingSchema from "../validators/tokenlist.validator";
import service from "../services/service";

/**
 * Token routes for handling frontend and admin token management.
 * These routes include operations for creating, listing, editing, and managing tokens and their staking status.
 */
class tokenRoutes extends BaseController {
    router = Router();

    /**
     * Initializes routes related to tokens, including frontend and admin operations.
     * This sets up routes for creating tokens, listing tokens, changing token status, and enabling staking.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines the routes for managing tokens:
     * - Frontend routes for creating, listing, and viewing tokens.
     * - Admin routes for creating, editing, managing token status, and enabling staking.
     */
    init() {

        let tokens = new tokenController();
        let tone_list = new tokenListingController();
        let auth = new authController().auth;

        // ===============================================
        // Frontend client routes
        // ===============================================

        /**
         * Route to get all tokens.
         * Fetches the list of all tokens.
         */
        this.router.get('/', tokens.tokenAll);

        /**
         * Route to get all future tokens.
         * Fetches the list of future tokens.
         */
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
        /**
         * Route for creating a new token.
         * 
         * Only authenticated users can create tokens.
         */
        this.router.post('/create', auth, super.Validator(tokenSchema.create), tokens.create);

        /**
         * Route to get the top gainer tokens.
         * Fetches the list of top performing tokens.
         */
        this.router.get('/topgainer', tone_list.topGainerList);

        // ===============================================
        // Admin routes
        // ===============================================

        /**
         * Route to get the list of all tokens for the admin.
         * Fetches all tokens managed by the admin.
         */
        this.router.get('/list/all', tokens.adminTokenAll);

            /**
         * Listed token edit by admin in dashboard 
        **/
        // this.router.post('/edit', auth, service.upload.upload("token", ['jpg', 'png', 'svg'], 2, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenSchema.edit), tokens.edit);
        /**
         * Route to get a paginated list of tokens.
         * Requires `offset` and `limit` parameters for pagination.
         */
        this.router.get('/all/:offset/:limit', auth, tokens.tokenAllWithLimit);

        /**
         * Route to edit token details.
         * Admins can modify the token's details such as image, name, etc.
         */
        this.router.post('/edit', auth, super.Validator(tokenSchema.edit), tokens.edit);

        /**
         * Route to change the status of a token (active/inactive).
         * Admins can control the visibility of tokens on the frontend.
         */
        this.router.put('/change/status', auth, tokens.activeInactiveToken);

        /**
         * Route to enable or disable staking for a token.
         * Admins can control whether staking is allowed for a specific token.
         */
        this.router.put('/stake/status', auth, tokens.stakeStatus);

        /**
         * Route for admin to create a new token listing.
         * Admins can list new tokens with an image upload.
         */
        this.router.post('/token_list/create', auth, service.upload.upload("token", ['jpg', 'png'], 2, [
            {
                name: "logo",
                maxCount: 1,
            },
        ]), super.Validator(tokenListingSchema.create), tone_list.create);

        /**
         * Route to get the list of tokens that have been listed by the admin.
         * Fetches all tokens listed by the admin for public visibility.
         */
        this.router.get('/list', tone_list.tokenList);

        /**
         * Route to update the network/chain for a token.
         * Admins can assign a global network or blockchain to a token.
         */
        this.router.post('/update/network', auth, tokens.updateNetwork);
    }
}

export default new tokenRoutes().router;
