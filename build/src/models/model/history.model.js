"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class historyModel extends sequelize_1.Model {
    id;
    userid;
    tokenid;
    type;
    previous_bal;
    amount;
    current_bal;
    action;
    market_seller_orderid;
    market_buyer_orderid;
    market_match_userid;
    p2p_orderid;
    p2p_match_userid;
    deposit_id;
    withdraw_id;
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
            userid: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            tokenid: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            previous_bal: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            current_bal: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            action: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            market_seller_orderid: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
            market_buyer_orderid: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
            market_match_userid: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
            p2p_orderid: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
            p2p_match_userid: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
            deposit_id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
            withdraw_id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: 0,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_histories",
            paranoid: true,
        });
    }
}
exports.default = historyModel;
