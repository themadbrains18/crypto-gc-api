import { BlobOptions } from "buffer";
import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface marketOrderHistoryAtteribute {
  id?: string;

  order_id?: string;
  user_id?: string;
  token_id?: string;
  market_type?: string;
  order_type?: string;
  limit_usdt?: number;
  volume_usdt?: number;
  token_amount?: number;
  status?: boolean;
  isCanceled?: boolean;
  entry_id?: number;
  fee?: number;
  wallet_amount?: number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface marketOrderHistoryInput
  extends Optional<marketOrderHistoryAtteribute, "id"> { }
export interface marketOrderHistoryOuput
  extends Required<marketOrderHistoryAtteribute> { }

class marketOrderHistoryModel
  extends Model<marketOrderHistoryAtteribute, marketOrderHistoryInput>
  implements marketOrderHistoryAtteribute {
  public id!: string;

  public order_id!: string;
  public user_id!: string;
  public token_id!: string;
  public market_type!: string;
  public order_type!: string;
  public limit_usdt!: number;
  public token_amount!: number;
  public status!: boolean;
  public volume_usdt!: number;
  public isCanceled!: boolean;
  public entry_id!: number;
  public fee!: number;
  public wallet_amount!: number;
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
        order_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        market_type: {
          type: DataTypes.ENUM("limit", "market"),
          defaultValue: "limit",
        },
        order_type: {
          type: DataTypes.ENUM("buy", "sell"),
          allowNull: false,
        },
        limit_usdt: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
        },
        volume_usdt: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
        },
        token_amount: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isCanceled: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        entry_id: {
          type: DataTypes.BIGINT,
          defaultValue: 0,
        },
        fee: {
          type: DataTypes.DOUBLE,
          defaultValue: 0
        },
        wallet_amount: {
          type: DataTypes.DOUBLE,
          defaultValue: 0
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "market_order_histroy",
        paranoid: true,
      }
    );
  }
}

export default marketOrderHistoryModel;
