"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class orderModel extends sequelize_1.Model {
    id;
    post_id;
    sell_user_id;
    buy_user_id;
    token_id;
    price;
    quantity;
    spend_amount;
    receive_amount;
    spend_currency;
    receive_currency;
    p_method;
    // public isComplete?: boolean;
    // public isCanceled?: boolean;
    // public inProcess?: boolean;
    // public isReleased?: boolean;
    status;
    type;
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
            post_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            sell_user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            buy_user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            quantity: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            spend_amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            receive_amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            spend_currency: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            receive_currency: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            p_method: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            // isComplete: {
            //   type: DataTypes.BOOLEAN,
            //   defaultValue: false,
            // },
            // isCanceled: {
            //   type: DataTypes.BOOLEAN,
            //   defaultValue: false,
            // },
            // inProcess: {
            //   type: DataTypes.BOOLEAN,
            //   defaultValue: true,
            // },
            // isReleased: {
            //   type: DataTypes.BOOLEAN,
            //   defaultValue: false,
            // },
            status: {
                type: sequelize_1.DataTypes.ENUM("isProcess", "isCompleted", "isCanceled", "isReleased"),
                defaultValue: 'isProcess'
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("buy", "sell"),
                defaultValue: "buy",
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "orders",
            paranoid: true,
        });
    }
}
exports.default = orderModel;
