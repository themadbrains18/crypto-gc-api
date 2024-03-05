"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../services/service"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const models_1 = require("../models");
class authController extends main_controller_1.default {
    /**
     *
     * @param req
     * @param Res
     * @param next
     */
    async auth(req, res, next) {
        try {
            // console.log(req.headers["authorization"])
            const authHeader = 'Bearer' + ' ' + req.headers["authorization"];
            // const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            if (token == null)
                return res.sendStatus(403);
            let reslt = await service_1.default.jwt.verify(token);
            // console.log(reslt,"==reslt auth");
            if (reslt.status !== undefined && reslt.status === 404)
                return super.fail(res, "Unuthorized User");
            req.headers.user = reslt;
            req.body.user_id = reslt.user_id;
            next();
        }
        catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param permittedRoles
     * @returns
     */
    permit = (...permittedRoles) => async (req, res, next) => {
        try {
            let { user } = req.headers;
            if (user === undefined || user === null)
                return res.status(403).json({ message: "Forbidden" }); // user is forbidden
            if (user && permittedRoles.includes(user?.role)) {
                let matchRole = await models_1.userModel.findByPk(user?.user_id, {
                    raw: true,
                });
                //  check if user account is active or not
                if (!matchRole.statusType)
                    return res.status(403).json({ message: "Your account has been restricted. Please contact to administration." });
                if (matchRole?.role === user.role) {
                    req.headers.info = matchRole;
                    next(); // role is allowed, so continue on the next middleware
                }
                else {
                    return res.status(403).json({ message: "Forbidden" }); // user is forbidden
                }
            }
            else {
                return res.status(403).json({
                    message: "Forbidden, Sorry you do not have access to this route",
                }); // user is forbidden
            }
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = authController;
