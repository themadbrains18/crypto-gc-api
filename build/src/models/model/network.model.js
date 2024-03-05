"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class networkModel extends sequelize_1.Model {
    id;
    user_id;
    symbol;
    fullname;
    network;
    chainId;
    status;
    rpcUrl;
    BlockExplorerURL;
    walletSupport;
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
            symbol: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                // unique: {
                //   name: "name",
                //   msg: 'Network name is already exist.' 
                // },
            },
            fullname: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: {
                    name: "fullname",
                    msg: 'Network fullname is already exist.'
                },
            },
            network: {
                type: sequelize_1.DataTypes.ENUM("testnet", "mainnet"),
                allowNull: false,
                defaultValue: 'mainnet'
            },
            walletSupport: {
                type: sequelize_1.DataTypes.ENUM('sol', 'tron', 'eth'),
                allowNull: false,
                defaultValue: 'eth'
            },
            chainId: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false,
                unique: {
                    name: "chainId",
                    msg: 'chainId is already exist.'
                },
            },
            BlockExplorerURL: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: {
                    name: "BlockExplorerURL",
                    msg: 'Block Explorer URL is already exist.'
                },
            },
            rpcUrl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: true
                }
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "networks",
            paranoid: true,
        });
    }
}
exports.default = networkModel;
