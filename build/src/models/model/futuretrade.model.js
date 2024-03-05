"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class futureTradePairModel extends sequelize_1.Model {
    id;
    coin_id;
    usdt_id;
    coin_symbol;
    usdt_symbol;
    coin_fee;
    usdt_fee;
    coin_min_trade;
    usdt_min_trade;
    status;
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
            coin_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            usdt_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            coin_symbol: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            usdt_symbol: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            coin_fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            usdt_fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            coin_min_trade: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            usdt_min_trade: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "futuretradepair",
            paranoid: true,
        });
    }
}
exports.default = futureTradePairModel;
