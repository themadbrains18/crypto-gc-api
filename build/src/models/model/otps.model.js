"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class userOtpModel extends sequelize_1.Model {
    id;
    otp;
    username;
    expire;
    token;
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
                primaryKey: true
            },
            otp: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            username: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            token: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            expire: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "usersotp",
            paranoid: true,
        });
    }
}
exports.default = userOtpModel;
