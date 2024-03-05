"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class stakingModel extends sequelize_1.Model {
    id;
    user_id;
    token_id;
    amount;
    apr;
    time_log;
    time_format;
    status;
    queue;
    redeem;
    unstacking;
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
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: "",
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            apr: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            time_log: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            time_format: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            queue: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            redeem: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            unstacking: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_staking",
            paranoid: true,
        });
    }
}
exports.default = stakingModel;
