"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class kycController extends main_controller_1.default {
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
    async create(req, res, next) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] = obj[itm][0]?.filename;
                req.body.destinationPath = obj[itm][0]?.destination;
            }
            let kyc = req.body;
            let kycAlreadyAdded = await service_1.default.kyc.alreadyExist(kyc);
            // if already kyc available but in pending state
            if (kycAlreadyAdded.length > 0 && kycAlreadyAdded[0].isReject === false) {
                return super.clientError(res, {
                    message: "Sorry, you are already submit kyc request!!",
                    result: kycAlreadyAdded
                });
            }
            // if already kyc available but admin rejected and user re-submit request
            if (kycAlreadyAdded.length > 0 && kycAlreadyAdded[0].isReject === true) {
                kyc.userid = kycAlreadyAdded[0].user_id;
                let tokenResponse = await service_1.default.kyc.edit(kyc);
                super.ok(res, { message: "Kyc successfully Added.", result: tokenResponse });
            }
            let tokenResponse = await service_1.default.kyc.create(kyc);
            super.ok(res, { message: "Kyc successfully Added.", result: tokenResponse });
        }
        catch (error) {
            return super.fail(res, error?.message);
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    institutecreate(req, res) {
    }
    /**
     *
     * @param res
     * @param req
     */
    async kycById(req, res, next) {
        try {
            let kycResponse = await service_1.default.kyc.getKycById(req.params.id);
            super.ok(res, { message: "user Kyc", result: kycResponse });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user kyc status approve or ignore
     * @param req
     * @param res
     */
    async kycStatus(req, res, next) {
        try {
            let kyc = req.body;
            let userKyc = await service_1.default.kyc.alreadyExist(kyc);
            if (userKyc.length > 0) {
                let kycResponse = await service_1.default.kyc.updateStatus(kyc);
                if (kycResponse) {
                    let kycs = await service_1.default.kyc.getAllKyc('All');
                    super.ok(res, { message: "Kyc status successfully updated.", result: kycs });
                }
            }
        }
        catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    async kycAll(req, res, next) {
        try {
            let kycs = await service_1.default.kyc.getAllKyc(req.params.type);
            super.ok(res, kycs);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    async kycAllByLimit(req, res, next) {
        try {
            let { offset, limit } = req.params;
            let kycs = await service_1.default.kyc.getAllKyc(req.params.type);
            let kycPaginated = await service_1.default.kyc.getAllKycByLimit(req.params.type, offset, limit);
            super.ok(res, { data: kycPaginated, total: kycs });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = kycController;
