"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class marketOrderHistoryModel extends sequelize_1.Model {
    id;
    order_id;
    user_id;
    token_id;
    market_type;
    order_type;
    limit_usdt;
    token_amount;
    status;
    volume_usdt;
    isCanceled;
    entry_id;
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
            order_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            market_type: {
                type: sequelize_1.DataTypes.ENUM("limit", "market"),
                defaultValue: "limit",
            },
            order_type: {
                type: sequelize_1.DataTypes.ENUM("buy", "sell"),
                allowNull: false,
            },
            limit_usdt: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0,
            },
            volume_usdt: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0,
            },
            token_amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isCanceled: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            entry_id: {
                type: sequelize_1.DataTypes.BIGINT,
                defaultValue: 0,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "market_order_histroy",
            paranoid: true,
        });
    }
}
exports.default = marketOrderHistoryModel;
