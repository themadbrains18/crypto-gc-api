import { Model, Optional, DataTypes, Sequelize } from "sequelize";
import roles from "../../middlewares/_helper/roles";

interface UsersAttributes {
  id: string;
  number?: string;
  email?: string;
  dial_code?: string;
  password?: string;
  blcAddress?: string;
  blcHashkey?: string;
  bep20Address?: string;
  bep20Hashkey?: string;
  trc20Address?: string;
  trc20Hashkey?: string;
  TwoFA?: boolean;
  kycstatus?: "on-hold" | "approve"  | "reject" | "NA";
  tradingPassword?: string;
  statusType?: boolean;
  registerType?: string;
  role?: string;
  secret?: string;
  own_code?: string;
  pin_code?: string;
  refeer_code?: string;
  antiphishing?: string;
  UID?: string;
  cronStatus?: string;
  otpToken?: string;
  referral_id?:string;
  pwdupdatedAt?:Date;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  
}

export interface UserInput extends Optional<UsersAttributes, "id"> {}  
export interface UserOuput extends Required<UsersAttributes> {}

class userModel
  extends Model<UsersAttributes, UserInput>
  implements UsersAttributes
{
  public id!: string;

  public number!: string;
  public email!: string;
  public dial_code!: string;
  public password!: string;
  public blcAddress!: string;
  public blcHashkey!: string;
  public bep20Address!: string;
  public bep20Hashkey!: string;
  public trc20Address!: string;
  public trc20Hashkey!: string;
  public TwoFA!: boolean;
  public kycstatus!: "on-hold" | "approve"  | "reject" | "NA";
  public tradingPassword!: string;
  public statusType!: boolean;
  public registerType!: string;
  public role!: string;
  public secret!: string;
  public own_code!: string;
  public pin_code!: string;
  public refeer_code!: string;
  public antiphishing!: string;
  public UID!: string;
  public cronStatus!: string;
  public otpToken!: string;
  public referral_id!:string;
  public pwdupdatedAt!:Date;

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
        number: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        otpToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        dial_code: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        TwoFA: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false
        },
        kycstatus: {
          type: DataTypes.ENUM("on-hold","approve","reject","NA"),
          defaultValue:"on-hold"
        },
        tradingPassword: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        statusType: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        registerType: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        role: {
          type: DataTypes.ENUM(...Object.keys(roles)),
          allowNull: true,
          defaultValue : roles.user
        },
        secret: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        own_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        pin_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        refeer_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        antiphishing: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        UID: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        cronStatus: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        pwdupdatedAt:{
          type :DataTypes.DATE,
          allowNull:true
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "users",
        paranoid: true,
      }
    );
  }
}

export default userModel;