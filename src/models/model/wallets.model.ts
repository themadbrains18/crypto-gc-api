import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface walletAtteribute {
  id?: string;
  wallets?: object;
  user_id?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface walletInput extends Optional<walletAtteribute, "id"> {}
export interface walletOuput extends Required<walletAtteribute> {}

class walletsModel
  extends Model<walletAtteribute, walletInput>
  implements walletAtteribute
{
  public id!: string;
  public wallets!: object;
  public user_id!: string;

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
        wallets: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique : {
            name : "user_id",
            msg : "Users wallets address is already created."
          }
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "wallets",
        paranoid: true,
      }
    );
  }
}

export default walletsModel;
