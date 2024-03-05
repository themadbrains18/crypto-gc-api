"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class depositModel extends sequelize_1.Model {
    id;
    address;
    coinName;
    network;
    amount;
    tx_hash;
    blockHeight;
    successful;
    user_id;
    cronStatus;
    transferHash;
    contract;
    gasFee;
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
            address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            coinName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            network: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            tx_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: {
                    name: "tx_hash",
                    msg: 'Block hash is already exist.'
                },
            },
            blockHeight: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            successful: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            cronStatus: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            transferHash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            contract: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            gasFee: {
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
            modelName: "user_deposit",
            paranoid: true,
        });
    }
}
exports.default = depositModel;
