import { BlobOptions } from "buffer";
import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface marketOrderAtteribute {
  id?: string;

  // order_id?:string;
  user_id?: string;
  token_id?: string;
  market_type?: string;
  order_type?: string;
  limit_usdt: number;
  volume_usdt?: number;
  token_amount: number;
  status?: boolean;
  isCanceled?: boolean;
  queue?: boolean;
  fee?: number;
  is_fee?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface marketOrderInput
  extends Optional<marketOrderAtteribute, "id"> { }
export interface marketOrderOuput extends Required<marketOrderAtteribute> { }

class marketOrderModel
  extends Model<marketOrderAtteribute, marketOrderInput>
  implements marketOrderAtteribute {
  public id!: string;

  // public order_id!:string;
  public user_id!: string;
  public token_id!: string;
  public market_type!: string;
  public order_type!: string;
  public limit_usdt!: number;
  public volume_usdt!: number;
  public token_amount!: number;
  public status!: boolean;
  public isCanceled!: boolean;
  public queue!: boolean;
  public fee!: number;
  public is_fee!: boolean;

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
        // order_id: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
        token_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
        market_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        order_type: {
          type: DataTypes.STRING,
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
          defaultValue: false
        },
        isCanceled: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        queue: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        fee :{
          type: DataTypes.DOUBLE,
          defaultValue: 0
        },
        is_fee:{
          type: DataTypes.BOOLEAN,
          defaultValue: false
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "marketorder",
        paranoid: true,
      }
    );
  }
}

export default marketOrderModel;
