"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class referProgramInviteModel extends sequelize_1.Model {
    id;
    user_id;
    referProgram_id;
    name;
    description;
    amount;
    token_id;
    referral_id;
    type;
    status;
    deposit;
    trade;
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
            referProgram_id: {
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
            referral_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            deposit: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false
            },
            trade: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "refer_program_invite",
            paranoid: true,
        });
    }
}
exports.default = referProgramInviteModel;
