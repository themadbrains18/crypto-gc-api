"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class tokensModel extends sequelize_1.Model {
    id;
    symbol;
    fullName;
    minimum_withdraw;
    decimals;
    tokenType;
    image;
    status;
    networks;
    price;
    min_price;
    max_price;
    type;
    maxSupply;
    circulatingSupply;
    totalSupply;
    rank;
    withdraw_fee;
    minimum_deposit;
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
            fullName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            minimum_withdraw: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            decimals: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            tokenType: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true,
            },
            networks: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0
            },
            min_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0,
            },
            max_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0,
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("user", "admin"),
                defaultValue: "user",
            },
            maxSupply: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0.0,
                allowNull: true
            },
            totalSupply: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0.0,
                allowNull: true
            },
            circulatingSupply: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0.0,
                allowNull: true
            },
            rank: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0,
                allowNull: true
            },
            withdraw_fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0.005,
                allowNull: true
            },
            minimum_deposit: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0.001,
                allowNull: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "tokens",
            paranoid: true,
        });
    }
}
exports.default = tokensModel;
