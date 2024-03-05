"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class marketOrderModel extends sequelize_1.Model {
    id;
    // public order_id!:string;
    user_id;
    token_id;
    market_type;
    order_type;
    limit_usdt;
    volume_usdt;
    token_amount;
    status;
    isCanceled;
    queue;
    fee;
    is_fee;
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
            // order_id: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            market_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            order_type: {
                type: sequelize_1.DataTypes.STRING,
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
                defaultValue: false
            },
            isCanceled: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            queue: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0
            },
            is_fee: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "marketorder",
            paranoid: true,
        });
    }
}
exports.default = marketOrderModel;
