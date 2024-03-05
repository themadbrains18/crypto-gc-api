"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class tokenListingModel extends sequelize_1.Model {
    id;
    user_id;
    name;
    symbol;
    logo;
    issue_price;
    issue_date;
    decimals;
    fees;
    max_supply;
    circulating_supply;
    explore_link;
    white_pp_link;
    website_link;
    introduction;
    network;
    status;
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
                allowNull: false
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            symbol: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            logo: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            issue_price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false
            },
            issue_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            decimals: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            fees: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true
            },
            max_supply: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true
            },
            circulating_supply: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true
            },
            explore_link: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            white_pp_link: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            website_link: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            introduction: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            network: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "tokens_list",
            paranoid: true,
        });
    }
}
exports.default = tokenListingModel;
