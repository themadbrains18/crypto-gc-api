import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import tokenListingDto from "../models/dto/token_listing.dto";
import { tokenListingOuput } from "../models/model/tokenListing.model";
import service from "../services/service";

class tokenListingController extends BaseController {
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
     * Creates a new token listing.
     * @param req - The request object containing the file and other data
     * @param res - The response object
     */
    async create(req: Request, res: Response) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] = obj[itm][0]?.filename;
            }

            let token: tokenListingDto = req.body;
            token.status = false;

            let tokenResponse = await service.token_list.create(token);

            super.ok<any>(res, { message: " Token list successfully!!.", result: tokenResponse });
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    /**
     * Gets the list of all token listings.
     * @param req - The request object
     * @param res - The response object
     */ 
    async tokenList(req: Request, res :Response){
        try {
            let tokenResponse = await service.token_list.getTokenList();

            super.ok<any>(res,tokenResponse);
        } catch (error:any) {
            super.fail(res,error.message);
        }
    }

    /**
     * Gets the top gainers from an external API (LiveCoinWatch).
     * @param req - The request object
     * @param res - The response object
     */
    async topGainerList(req:Request, res:Response){
        try {
            let coinList = await fetch("https://http-api.livecoinwatch.com/coins/movers?currency=USD&range=delta.day&volume=500000", {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json",
            }),
        });

        let data = await coinList.json();
        super.ok<any>(res,data.gainers);
        } catch (error:any) {
            super.fail(res,error.message);
        }
    }
}

export default tokenListingController;