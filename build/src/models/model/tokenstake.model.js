"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class tokenstakeModel extends sequelize_1.Model {
    id;
    token_id;
    minimum_amount;
    apr;
    lockTime;
    status;
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
            minimum_amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            apr: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            lockTime: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "token_stake",
            paranoid: true,
        });
    }
}
exports.default = tokenstakeModel;
