"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class paymentMethodModel extends sequelize_1.Model {
    id;
    payment_method;
    icon;
    region;
    fields;
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
            payment_method: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            icon: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            region: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            fields: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "master_payment_method",
            paranoid: true,
        });
    }
}
exports.default = paymentMethodModel;
