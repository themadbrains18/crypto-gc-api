"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class chatModel extends sequelize_1.Model {
    id;
    post_id;
    sell_user_id;
    buy_user_id;
    orderid;
    chat;
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
            post_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            sell_user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            buy_user_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            orderid: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            chat: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_p2p_chat",
            paranoid: true,
        });
    }
    static associations;
}
exports.default = chatModel;
