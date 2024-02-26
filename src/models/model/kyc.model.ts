import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface kycAtteribute {
  id?: string;
  userid?: string;
  country?: string;
  fname?: string;
  // lname?: string;
  doctype?: string;
  docnumber?: string;
  dob?: Date;
  idfront?: string;
  idback?: string;
  statement?: string;
  isVerified?: boolean;
  isReject?: boolean;
  destinationPath?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface kycInput extends Optional<kycAtteribute, "id"> {}
export interface kycOuput extends Required<kycAtteribute> {}

class kycModel extends Model<kycAtteribute, kycInput> implements kycAtteribute {
  public id!: string;

  public userid!: string;
  public country!: string;
  public fname!: string;
  // public lname!: string;
  public doctype!: string;
  public docnumber!: string;
  public dob!: Date;
  public idfront!: string;
  public idback!: string;
  public statement!: string;
  public isVerified!: boolean;
  public isReject!: boolean;
  public destinationPath?: string;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        userid: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            name : "userid",
            msg : "Sorry, you are already submit kyc request!!"
          },
        },
        country: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        fname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // lname: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        // },
        doctype: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        docnumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dob: {
          type: DataTypes.DATE,
        },
        idfront: {
          type: DataTypes.STRING,
        },
        idback: {
          type: DataTypes.STRING,
        },
        statement: {
          type: DataTypes.STRING,
        },
      
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isReject: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        destinationPath:{
          type: DataTypes.STRING,
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_kyc",
        paranoid: true,
      }
    );
  }
}

export default kycModel;
