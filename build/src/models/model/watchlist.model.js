"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class watchlistModel extends sequelize_1.Model {
    id;
    user_id;
    token_id;
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
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_watchlist",
            paranoid: true,
        });
    }
}
exports.default = watchlistModel;
