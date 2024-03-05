"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class userPmethodModel extends sequelize_1.Model {
    id;
    user_id;
    pmid;
    status;
    pm_name;
    pmObject;
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
            pmid: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM,
                values: ["active", "hold"],
                allowNull: false,
            },
            pm_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            pmObject: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_payment_methods",
            paranoid: true,
        });
    }
}
exports.default = userPmethodModel;
