"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class futureOpenOrderModel extends sequelize_1.Model {
    id;
    position_id;
    user_id;
    symbol;
    side;
    type;
    time;
    amount;
    price_usdt;
    trigger;
    reduce_only;
    post_only;
    status;
    leverage;
    market_price;
    liq_price;
    margin;
    order_type;
    leverage_type;
    coin_id;
    isDeleted;
    qty;
    isTrigger;
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
            position_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            symbol: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            side: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            time: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: new Date()
            },
            amount: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            price_usdt: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            trigger: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            reduce_only: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            post_only: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
            leverage: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 1
            },
            market_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            liq_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            margin: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            },
            order_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            leverage_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            coin_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            isDeleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            qty: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            isTrigger: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "futureopenorder",
            paranoid: true,
        });
    }
}
exports.default = futureOpenOrderModel;
