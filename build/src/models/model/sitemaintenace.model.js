"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class siteMaintenanceModel extends sequelize_1.Model {
    id;
    title;
    message;
    down_status;
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
            title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            down_status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "sitemaintenance",
            paranoid: true,
        });
    }
}
exports.default = siteMaintenanceModel;
