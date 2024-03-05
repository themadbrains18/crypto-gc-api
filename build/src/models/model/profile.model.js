"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class profileModel extends sequelize_1.Model {
    id;
    user_id;
    fName;
    lName;
    dName;
    uName;
    image;
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
            fName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            lName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            dName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            uName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "profile",
            paranoid: true,
        });
    }
}
exports.default = profileModel;
