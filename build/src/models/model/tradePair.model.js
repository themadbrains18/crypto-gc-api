"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class tradePairModel extends sequelize_1.Model {
    id;
    tokenOne;
    tokenTwo;
    symbolOne;
    symbolTwo;
    maker;
    taker;
    min_trade;
    status;
    limit_trade;
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
            tokenOne: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            tokenTwo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            symbolOne: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            symbolTwo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            maker: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            taker: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            min_trade: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
            limit_trade: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "tradepair",
            paranoid: true,
        });
    }
}
exports.default = tradePairModel;
