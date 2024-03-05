"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class lastLoginModel extends sequelize_1.Model {
    id;
    user_id;
    loginTime;
    lastLogin;
    browser;
    deviceType;
    os;
    ip;
    location;
    region;
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
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            loginTime: {
                type: sequelize_1.DataTypes.DATE,
            },
            lastLogin: {
                type: sequelize_1.DataTypes.DATE,
            },
            browser: {
                type: sequelize_1.DataTypes.STRING,
            },
            deviceType: {
                type: sequelize_1.DataTypes.STRING,
            },
            os: {
                type: sequelize_1.DataTypes.STRING,
            },
            ip: {
                type: sequelize_1.DataTypes.STRING,
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
            },
            region: {
                type: sequelize_1.DataTypes.STRING,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "lastlogin",
            paranoid: true,
        });
    }
}
exports.default = lastLoginModel;
