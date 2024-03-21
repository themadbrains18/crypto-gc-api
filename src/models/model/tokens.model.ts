import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface tokenAtteribute {
  id?: string;
  symbol?: string;
  fullName?: string;
  minimum_withdraw?: string;
  decimals?: string;
  tokenType?: string;
  image?: string;
  status?: boolean;
  networks?: any[] | string;
  price?: number; //DOUBLE
  min_price?: string;
  max_price?: string;
  type?: string;
  maxSupply?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  rank?: number;
  withdraw_fee?:number;
  minimum_deposit?:number;
  marketcap?:number;
  volume?:number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}


export interface tokenInput extends Optional<tokenAtteribute, "id"> { }
export interface tokenOuput extends Required<tokenAtteribute> { }

class tokensModel
  extends Model<tokenAtteribute, tokenInput>
  implements tokenAtteribute {
  public id!: string;
  public symbol!: string;
  public fullName!: string;
  public minimum_withdraw!: string;
  public decimals!: string;
  public tokenType!: string;
  public image!: string;
  public status!: boolean;
  public networks!: any[] | string;
  public price!: number;
  public min_price!: string;
  public max_price!: string;
  public type!: string;
  public maxSupply!: number;
  public circulatingSupply!: number;
  public totalSupply!: number;
  public rank!: number;
  public withdraw_fee!:number;
  public minimum_deposit!:number;
  public marketcap!: number;
  public volume!: number;

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
        symbol: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        minimum_withdraw: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        decimals: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tokenType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        },
        networks: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0.0
        },
        min_price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0.0,
        },
        max_price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0.0,
        },
        type: {
          type: DataTypes.ENUM("user", "admin"),
          defaultValue: "user",
        },
        maxSupply: {
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          allowNull: true
        },
        totalSupply: {
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          allowNull: true
        },
        circulatingSupply: {
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          allowNull: true
        },
        rank :{
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          allowNull: true
        },
        withdraw_fee:{
          type: DataTypes.DOUBLE,
          defaultValue: 0.005,
          allowNull: true
        },
        minimum_deposit :{
          type: DataTypes.DOUBLE,
          defaultValue: 0.001,
          allowNull: false
        },
        marketcap: {
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          allowNull: true
        },
        volume: {
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          allowNull: true
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "tokens",
        paranoid: true,
      }
    );
  }
}

export default tokensModel;
