"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class userRewardModel extends sequelize_1.Model {
    id;
    user_id;
    type;
    amount;
    claim;
    description;
    claimed_on;
    expired_on;
    status;
    coupan_code;
    event_id;
    event_type;
    refer_user;
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
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            claim: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            claimed_on: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            expired_on: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            coupan_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            event_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            event_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            refer_user: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_reward",
            paranoid: true,
        });
    }
}
exports.default = userRewardModel;
