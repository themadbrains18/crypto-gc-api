"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class convertHistoryModel extends sequelize_1.Model {
    id;
    token_id;
    type;
    amount;
    fees;
    balance;
    user_id;
    convert_id;
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
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0
            },
            fees: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0
            },
            balance: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            convert_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_convert_history",
            paranoid: true,
        });
    }
}
exports.default = convertHistoryModel;
