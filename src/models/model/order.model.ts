import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface orderAtteribute {
  id?: string;

  post_id?: string;
  sell_user_id?: string;
  buy_user_id?: string;
  token_id?: string;
  price?: number;
  quantity?: number;
  spend_amount?: number;
  receive_amount?: number;
  spend_currency?: string;
  receive_currency?: string;
  p_method?: string;
  // isComplete?: boolean;
  // isCanceled?: boolean;
  // inProcess?: boolean;
  // isReleased?: boolean;
  status?:string;
  type?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface orderInput extends Optional<orderAtteribute, "id"> {}
export interface orderOuput extends Required<orderAtteribute> {}

class orderModel
  extends Model<orderAtteribute, orderInput>
  implements orderAtteribute
{
  public id!: string;

  public post_id?: string;
  public sell_user_id?: string;
  public buy_user_id?: string;
  public token_id?: string;
  public price?: number;
  public quantity?: number;
  public spend_amount?: number;
  public receive_amount?: number;
  public spend_currency?: string;
  public receive_currency?: string;
  public p_method?: string;
  // public isComplete?: boolean;
  // public isCanceled?: boolean;
  // public inProcess?: boolean;
  // public isReleased?: boolean;
  public status?:string;
  public type?: string;

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
        post_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sell_user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        buy_user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        spend_amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        receive_amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        spend_currency: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        receive_currency: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        p_method: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // isComplete: {
        //   type: DataTypes.BOOLEAN,
        //   defaultValue: false,
        // },
        // isCanceled: {
        //   type: DataTypes.BOOLEAN,
        //   defaultValue: false,
        // },
        // inProcess: {
        //   type: DataTypes.BOOLEAN,
        //   defaultValue: true,
        // },
        // isReleased: {
        //   type: DataTypes.BOOLEAN,
        //   defaultValue: false,
        // },
        status:{
          type : DataTypes.ENUM("isProcess","isCompleted","isCanceled","isReleased"),
          defaultValue : 'isProcess'
        },
        type: {
          type: DataTypes.ENUM("buy", "sell"),
          defaultValue: "buy",
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "orders",
        paranoid: true,
      }
    );
  }
}

export default orderModel;
