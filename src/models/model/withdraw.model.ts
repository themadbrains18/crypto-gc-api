import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface withdrawAtteribute {
  id?: string;
  symbol?: string;
  tokenName?: string;
  tokenID?: string;
  withdraw_wallet?: string;
  amount?: number;

  status?: string;
  user_id?: string;
  tx_hash?: string;
  tx_type?: string;
  fee?: string;
  networkId?: string;
  type?: string;
  adminApproved?: string;
  queue?: boolean;
  ignore?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface assetInput extends Optional<withdrawAtteribute, "id"> {}
export interface assetOuput extends Required<withdrawAtteribute> {}

class withdrawModel
  extends Model<withdrawAtteribute, assetInput>
  implements withdrawAtteribute
{
  public id!: string;
  public symbol!: string;
  public tokenName!: string;
  public tokenID!: string;
  public withdraw_wallet!: string;
  public amount!: number;

  public status?: string;
  public user_id?: string;
  public tx_hash?: string;
  public tx_type?: string;
  public fee?: string;
  public networkId?: string;
  public type?: string;
  public adminApproved?: string;
  public queue?: boolean;
  public ignore?: boolean;

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
        tokenName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tokenID: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        withdraw_wallet: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["success", "pending", "cancel"],
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tx_hash: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tx_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        fee: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        networkId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        adminApproved: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        queue: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        ignore: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "withdraws",
        paranoid: true,
      }
    );
  }
}

export default withdrawModel;
