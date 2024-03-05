"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class withdrawModel extends sequelize_1.Model {
    id;
    symbol;
    tokenName;
    tokenID;
    withdraw_wallet;
    amount;
    status;
    user_id;
    tx_hash;
    tx_type;
    fee;
    networkId;
    type;
    adminApproved;
    queue;
    ignore;
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
            tokenName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            tokenID: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            withdraw_wallet: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM,
                values: ["success", "pending", "cancel"],
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            tx_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            tx_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            networkId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            adminApproved: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            queue: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            ignore: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "withdraws",
            paranoid: true,
        });
    }
}
exports.default = withdrawModel;
