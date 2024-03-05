"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class notificationModel extends sequelize_1.Model {
    id;
    sender;
    receiver;
    type;
    orderid;
    status;
    message;
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
            sender: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            receiver: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            orderid: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            message: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "notifications",
            paranoid: true,
        });
    }
}
exports.default = notificationModel;
