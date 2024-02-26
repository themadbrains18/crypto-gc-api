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
  withdraw_fee?: number;
  minimum_deposit?:number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}


export interface globalTokenInput extends Optional<tokenAtteribute, "id"> { }
export interface globalTokenOuput extends Required<tokenAtteribute> { }

class globalTokensModel
  extends Model<tokenAtteribute, globalTokenInput>
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
          allowNull: true,
        },
        decimals: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tokenType: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'global'
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
          allowNull: true,
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0.0
        },
        min_price: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0.0,
        },
        max_price: {
          type: DataTypes.DOUBLE,
          allowNull: true,
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
        rank: {
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
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "global_tokens",
        paranoid: true,
      }
    );
  }
}

export default globalTokensModel;
