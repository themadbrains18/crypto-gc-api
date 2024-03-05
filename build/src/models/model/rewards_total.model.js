"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class userRewardTotalModel extends sequelize_1.Model {
    id;
    user_id;
    amount;
    order_amount;
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
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            order_amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_reward_total",
            paranoid: true,
        });
    }
}
exports.default = userRewardTotalModel;
