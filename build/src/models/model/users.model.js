"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const roles_1 = __importDefault(require("../../middlewares/_helper/roles"));
class userModel extends sequelize_1.Model {
    id;
    number;
    email;
    dial_code;
    password;
    blcAddress;
    blcHashkey;
    bep20Address;
    bep20Hashkey;
    trc20Address;
    trc20Hashkey;
    TwoFA;
    kycstatus;
    tradingPassword;
    statusType;
    registerType;
    role;
    secret;
    own_code;
    pin_code;
    refeer_code;
    antiphishing;
    UID;
    cronStatus;
    otpToken;
    referral_id;
    // timestamps!
    createdAt;
    updatedAt;
    deletedAt;
    static initialize(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            otpToken: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            dial_code: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            TwoFA: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            kycstatus: {
                type: sequelize_1.DataTypes.ENUM("on-hold", "approve", "reject", "NA"),
                defaultValue: "on-hold"
            },
            tradingPassword: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            statusType: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            registerType: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM(...Object.keys(roles_1.default)),
                allowNull: true,
                defaultValue: roles_1.default.user
            },
            secret: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            own_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            pin_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            refeer_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            antiphishing: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
            },
            UID: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            cronStatus: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "users",
            paranoid: true,
        });
    }
}
exports.default = userModel;
