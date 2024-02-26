import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface historyAtteribute {
  id?: string;

  userid?: string;
  tokenid?: string;
  type?: string;
  previous_bal?: number;
  amount?: number;
  current_bal?: number;
  action?: string;
  market_seller_orderid?: string;
  market_buyer_orderid?: string;
  market_match_userid?: string;
  p2p_orderid?: string;
  p2p_match_userid?: string;
  deposit_id?: string;
  withdraw_id?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface historyInput extends Optional<historyAtteribute, "id"> {}
export interface historyOuput extends Required<historyAtteribute> {}

class historyModel
  extends Model<historyAtteribute, historyInput>
  implements historyAtteribute
{
  public id!: string;

  public userid!: string;
  public tokenid!: string;
  public type!: string;
  public previous_bal!: number;
  public amount!: number;
  public current_bal!: number;
  public action!: string;
  public market_seller_orderid!: string;
  public market_buyer_orderid!: string;
  public market_match_userid!: string;
  public p2p_orderid!: string;
  public p2p_match_userid!: string;
  public deposit_id!: string;
  public withdraw_id!: string;
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
        userid: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        tokenid: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        previous_bal: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        current_bal: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        action: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        market_seller_orderid: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        market_buyer_orderid: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        market_match_userid: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        p2p_orderid: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        p2p_match_userid: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        deposit_id: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
        withdraw_id: {
          type: DataTypes.STRING,
          defaultValue: 0,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_histories",
        paranoid: true,
      }
    );
  }
}

export default historyModel;
