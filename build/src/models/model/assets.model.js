"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class assetModel extends sequelize_1.Model {
    id;
    user_id;
    account_type;
    walletTtype;
    token_id;
    balance;
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
            account_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            walletTtype: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            balance: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_assets",
            paranoid: true,
        });
    }
}
exports.default = assetModel;
