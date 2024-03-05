"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class kycModel extends sequelize_1.Model {
    id;
    userid;
    country;
    fname;
    // public lname!: string;
    doctype;
    docnumber;
    dob;
    idfront;
    idback;
    statement;
    isVerified;
    isReject;
    destinationPath;
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
            userid: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: {
                    name: "userid",
                    msg: "Sorry, you are already submit kyc request!!"
                },
            },
            country: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: "",
            },
            fname: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            // lname: {
            //   type: DataTypes.STRING,
            //   allowNull: false,
            // },
            doctype: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            docnumber: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            dob: {
                type: sequelize_1.DataTypes.DATE,
            },
            idfront: {
                type: sequelize_1.DataTypes.STRING,
            },
            idback: {
                type: sequelize_1.DataTypes.STRING,
            },
            statement: {
                type: sequelize_1.DataTypes.STRING,
            },
            isVerified: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isReject: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            destinationPath: {
                type: sequelize_1.DataTypes.STRING,
            }
        }, {
            timestamps: true,
            sequelize: sequelize,
            modelName: "user_kyc",
            paranoid: true,
        });
    }
}
exports.default = kycModel;
