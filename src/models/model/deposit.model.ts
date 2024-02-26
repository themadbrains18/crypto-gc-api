import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface depositAtteribute {
  id?: string;
  address?: string;
  coinName?: string;
  network?: string;
  amount?: string;
  tx_hash?: string;
  blockHeight?: string;
  successful?: string;
  user_id?: string;
  cronStatus?: boolean;
  transferHash?: string;
  contract?: string;
  gasFee?: boolean;
  queue?: boolean;
  ignore?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface depositInput extends Optional<depositAtteribute, "id"> {}
export interface depositOuput extends Required<depositAtteribute> {}

class depositModel
  extends Model<depositAtteribute, depositInput>
  implements depositAtteribute
{
  public id!: string;

  public address!: string;
  public coinName!: string;
  public network!: string;
  public amount!: string;
  public tx_hash!: string;
  public blockHeight!: string;
  public successful!: string;
  public user_id!: string;
  public cronStatus!: boolean;
  public transferHash!: string;
  public contract!: string;
  public gasFee!: boolean;
  public queue!: boolean;
  public ignore!: boolean;

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
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        coinName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        network: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tx_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            name : "tx_hash",
            msg: 'Block hash is already exist.' 
          },
        },
        blockHeight: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        successful: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cronStatus: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        transferHash: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        contract: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        gasFee: {
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
        modelName: "user_deposit",
        paranoid: true,
      }
    );
  }
}

export default depositModel;
