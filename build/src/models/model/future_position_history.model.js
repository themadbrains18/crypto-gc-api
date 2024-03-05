"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class futurePositionHistoryModel extends sequelize_1.Model {
    id;
    position_id;
    symbol;
    user_id;
    coin_id;
    market_price;
    status;
    direction;
    order_type;
    market_type;
    qty;
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
            market_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            status: {
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
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "futurepositionhistory",
            paranoid: true,
        });
    }
}
exports.default = futurePositionHistoryModel;
