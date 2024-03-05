"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class futurePositionModel extends sequelize_1.Model {
    id;
    symbol;
    user_id;
    coin_id;
    leverage;
    size;
    entry_price;
    market_price;
    liq_price;
    margin;
    margin_ratio;
    pnl;
    realized_pnl;
    tp_sl;
    position_mode;
    status;
    queue;
    direction;
    order_type;
    leverage_type;
    market_type;
    isDeleted;
    qty;
    assets_margin;
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
            symbol: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            coin_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            leverage: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 1
            },
            size: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            entry_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            market_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            liq_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            margin: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            },
            margin_ratio: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            },
            pnl: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            },
            realized_pnl: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            },
            tp_sl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            position_mode: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "oneWay"
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
            queue: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
            direction: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            order_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            leverage_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            market_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            isDeleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
            qty: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            assets_margin: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "futureposition",
            paranoid: true,
        });
    }
}
exports.default = futurePositionModel;
