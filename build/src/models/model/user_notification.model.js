"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class userNotificationModel extends sequelize_1.Model {
    id;
    user_id;
    type;
    message;
    status;
    url;
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
            message: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_notifications",
            paranoid: true,
        });
    }
}
exports.default = userNotificationModel;
