"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class AdminPayFeesModel extends sequelize_1.Model {
    id;
    deposit_id;
    trx_hash;
    user_address;
    fees;
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
            deposit_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            trx_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            user_address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            fees: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "admin_pay_fees",
            paranoid: true,
        });
    }
}
exports.default = AdminPayFeesModel;
