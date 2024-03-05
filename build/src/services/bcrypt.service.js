"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_service_1 = __importDefault(require("./main.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class bcryptService extends main_service_1.default {
    slate = 10;
    late_private = "s0//P4$$w0rD";
    /**
     *
     * @param Password noraml pass encrypt into hash
     * @returns
     */
    MDB_crateHash = async (Password) => {
        const salt = await bcrypt_1.default.genSalt(this.slate);
        const hash = await bcrypt_1.default.hash(Password, salt);
        return hash;
    };
    /**
     *
     * @param Password this text provided by user when he attempt to login
     * @param hash which pass is stored in your database
     */
    MDB_compareHash = (Password, hash) => {
        return bcrypt_1.default.compareSync(Password, hash); // true
    };
}
exports.default = bcryptService;
