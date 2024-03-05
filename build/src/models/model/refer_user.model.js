"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class referUserModel extends sequelize_1.Model {
    id;
    user_id;
    referral_user;
    event_id;
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
            referral_user: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            event_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "refer_user",
            paranoid: true,
        });
    }
}
exports.default = referUserModel;
