"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class walletsModel extends sequelize_1.Model {
    id;
    wallets;
    user_id;
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
            wallets: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: {
                    name: "user_id",
                    msg: "Users wallets address is already created."
                }
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "wallets",
            paranoid: true,
        });
    }
}
exports.default = walletsModel;
