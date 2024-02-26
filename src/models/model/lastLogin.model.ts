import { BlobOptions } from "buffer";
import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface lastLoginAtteribute {
  id?: string;
  user_id?: string;
  loginTime?: any;
  lastLogin?: any;
  browser?:string;
  deviceType?:string;
  os?:string;
  ip?:string;
  location?:string;
  region?:string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface lastLoginInput extends Optional<lastLoginAtteribute, "id"> {}
export interface lastLoginOuput extends Required<lastLoginAtteribute> {}

class lastLoginModel
  extends Model<lastLoginAtteribute, lastLoginInput>
  implements lastLoginAtteribute
{
  public id!: string;

  public user_id!: string;
  public loginTime!: any;
  public lastLogin!: any;
  public browser!: string;
  public deviceType!: string;
  public os!: string;
  public ip!: string;
  public location!: string;
  public region!: string;
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

        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        loginTime: {
          type: DataTypes.DATE,
        },
        lastLogin: {
          type: DataTypes.DATE,
        },
        browser:{
          type:DataTypes.STRING,
        },
        deviceType:{
          type:DataTypes.STRING,
        },
        os:{
          type:DataTypes.STRING,
        },
        ip:{
          type:DataTypes.STRING,
        },
        location:{
          type:DataTypes.STRING,
        },
        region:{
          type:DataTypes.STRING,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "lastlogin",
        paranoid: true,
      }
    );
  }
}

export default lastLoginModel;
