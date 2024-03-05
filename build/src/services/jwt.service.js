"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_service_1 = __importDefault(require("./main.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class jwt_token extends main_service_1.default {
    privateKey = process.env.TOKEN_KEY ||
        "$2b$10$oy2o.eHnBE1bZMyAkj4GQ.j0nT4ceDBNU7PZ71Tjp19Mpwf0.NGlW";
    sign = (obj, expireTime) => {
        let time = !!expireTime ? expireTime : "5h";
        let token = jsonwebtoken_1.default.sign(obj, this.privateKey, {
            expiresIn: time,
        });
        return token;
    };
    /**
     *
     * @param token if function will return any demon key word it means error in function
     */
    verify(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.privateKey, (err, user) => {
                if (err) {
                    return { "status": 404, "message": "err.message" };
                    // throw new Error(err.message);
                }
                return user;
            });
        }
        catch (error) {
            return error.message;
        }
    }
    ;
}
exports.default = jwt_token;
