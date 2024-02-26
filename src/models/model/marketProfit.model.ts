import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface MarketProfitAtteribute {
  id?: string;

  source_id?: string;
  total_usdt?: number;
  paid_usdt?: number;
  admin_usdt?: number;
  buyer?: string;
  seller?: string;
  source_type?: string; // future traing, spot trading, withdraw, refferal
  coin_type?: string; //bnb, eth, etc.
  fees?: number; //spot trading in case of buy and sell,
  profit?: number; //profit in USDT from all trades, and other source
  listing_fee?:number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MarketProfitInput
  extends Optional<MarketProfitAtteribute, "id"> { }
export interface MarketProfitOuput extends Required<MarketProfitAtteribute> { }

class MarketProfitModel
  extends Model<MarketProfitAtteribute, MarketProfitInput>
  implements MarketProfitAtteribute {
  public id!: string;

  public source_id!: string;
  public total_usdt!: number;
  public paid_usdt!: number;
  public admin_usdt!: number;
  public buyer!: string;
  public seller!: string;
  public source_type!: string;
  public coin_type!: string;
  public fees!: number;
  public profit!: number;
  public listing_fee!: number;

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
        source_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        total_usdt: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
        },
        paid_usdt: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
        },
        admin_usdt: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
        },
        buyer: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 0,
        },
        seller: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 0,
        },
        source_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        coin_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fees: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        profit: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        listing_fee: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        }

      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "admin_profit",
        paranoid: true,
      }
    );
  }
}

export default MarketProfitModel;
