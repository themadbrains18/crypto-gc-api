import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface futureTradePairAttribute {
  id?: string;
  coin_id?: string;
  usdt_id?: string;
  coin_symbol?: string;
  usdt_symbol?: string;
  coin_fee?:number;
  usdt_fee?:number;
  coin_min_trade?:number;
  usdt_min_trade?:number;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}


export interface futureTradePairInput extends Optional<futureTradePairAttribute, "id"> { }
export interface futureTradePairOuput extends Required<futureTradePairAttribute> { }

class futureTradePairModel
  extends Model<futureTradePairAttribute, futureTradePairInput>
  implements futureTradePairAttribute {
  public id!: string;
  public coin_id!: string;
  public usdt_id!: string;
  public coin_symbol!: string;
  public usdt_symbol!: string;
  public coin_fee!:number;
  public usdt_fee!:number;
  public coin_min_trade!:number;
  public usdt_min_trade!:number;
  public status!: boolean;
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
        coin_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        usdt_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        coin_symbol: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        usdt_symbol: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        coin_fee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        usdt_fee: {
            type: DataTypes.DOUBLE,
            allowNull: false,
          },
        coin_min_trade: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        usdt_min_trade:{
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "futuretradepair",
        paranoid: true,
      }
    );
  }
}

export default futureTradePairModel;
