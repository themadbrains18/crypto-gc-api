"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class MarketProfitModel extends sequelize_1.Model {
    id;
    source_id;
    total_usdt;
    paid_usdt;
    admin_usdt;
    buyer;
    seller;
    source_type;
    coin_type;
    fees;
    profit;
    listing_fee;
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
            source_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            total_usdt: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
            },
            paid_usdt: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
            },
            admin_usdt: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
            },
            buyer: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: 0,
            },
            seller: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: 0,
            },
            source_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            coin_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            fees: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            profit: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            listing_fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "admin_profit",
            paranoid: true,
        });
    }
}
exports.default = MarketProfitModel;
