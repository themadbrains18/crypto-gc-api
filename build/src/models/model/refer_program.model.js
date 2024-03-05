"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class referProgramModel extends sequelize_1.Model {
    id;
    user_id;
    name;
    description;
    amount;
    token_id;
    status;
    start_date;
    end_date;
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
            name: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: "",
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false
            },
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            start_date: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            end_date: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "refer_program",
            paranoid: true,
        });
    }
}
exports.default = referProgramModel;
