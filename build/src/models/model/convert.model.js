"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class convertModel extends sequelize_1.Model {
    id;
    converted;
    received;
    fees;
    conversion_rate;
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
            converted: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            received: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            fees: {
                type: sequelize_1.DataTypes.DOUBLE,
                defaultValue: 0
            },
            conversion_rate: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_convert",
            paranoid: true,
        });
    }
}
exports.default = convertModel;
