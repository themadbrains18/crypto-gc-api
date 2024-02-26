import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface futurePositionAttribute {
  id?: string;
  symbol?: string;
  user_id?: string;
  coin_id?: string;
  leverage?: number;
  size?: number;
  entry_price?: number;
  market_price?: number;
  liq_price?: number;
  margin?: number;
  margin_ratio?: number;
  pnl?: number;
  realized_pnl?: number;
  tp_sl?: string;
  position_mode?: string;
  status?: boolean;
  queue?: boolean;
  direction?: string;
  order_type?: string;
  leverage_type?: string;
  market_type?: string;
  isDeleted?: boolean;
  qty?: number;
  assets_margin?: number;
}


export interface futurePositionInput extends Optional<futurePositionAttribute, "id"> { }
export interface futurePositionOuput extends Required<futurePositionAttribute> { }

class futurePositionModel
  extends Model<futurePositionAttribute, futurePositionInput>
  implements futurePositionAttribute {
  public id!: string;
  public symbol!: string;
  public user_id!: string;
  public coin_id!: string;
  public leverage!: number;
  public size!: number;
  public entry_price!: number;
  public market_price!: number;
  public liq_price!: number;
  public margin!: number;
  public margin_ratio!: number;
  public pnl!: number;
  public realized_pnl!: number;
  public tp_sl!: string;
  public position_mode!: string;
  public status!: boolean;
  public queue!: boolean;
  public direction!: string;
  public order_type!: string;
  public leverage_type!: string;
  public market_type!: string;
  public isDeleted!: boolean;
  public qty!: number;
  public assets_margin!: number;
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
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        coin_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        leverage: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 1
        },
        size: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        entry_price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        market_price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        liq_price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        margin: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0
        },
        margin_ratio: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0
        },
        pnl: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0
        },
        realized_pnl: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0
        },
        tp_sl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        position_mode: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "oneWay"

        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        },
        queue: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        },
        direction: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        order_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        leverage_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        market_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        },
        qty: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        assets_margin: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "futurePosition",
        paranoid: true,
      }
    );
  }
}

export default futurePositionModel;
