"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class transferhistoryModel extends sequelize_1.Model {
    id;
    user_id;
    from;
    to;
    token_id;
    balance;
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
            from: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            to: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            token_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            balance: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "transferhistory",
            paranoid: true,
        });
    }
}
exports.default = transferhistoryModel;
