"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class postModel extends sequelize_1.Model {
    id;
    user_id;
    token_id;
    price;
    quantity;
    min_limit;
    max_limit;
    p_method;
    payment_time;
    notes;
    checked;
    status;
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
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            min_limit: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            max_limit: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            p_method: {
                type: sequelize_1.DataTypes.JSON,
            },
            payment_time: {
                type: sequelize_1.DataTypes.STRING,
            },
            notes: {
                type: sequelize_1.DataTypes.STRING,
            },
            checked: {
                type: sequelize_1.DataTypes.BOOLEAN,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true,
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_post",
            paranoid: true,
        });
    }
}
exports.default = postModel;
