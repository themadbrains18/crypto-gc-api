import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface assetsAtteribute {
  id?: string;
  user_id?: string;
  account_type?: string;
  walletTtype?: string;
  token_id?: string;
  balance?: number ;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface assetInput extends Optional<assetsAtteribute, "id"> {}
export interface assetOuput extends Required<assetsAtteribute> {}

class assetModel
  extends Model<assetsAtteribute, assetInput>
  implements assetsAtteribute
{
  public id!: string;
  public user_id!: string;
  public account_type!: string;
  public walletTtype!: string;
  public token_id!: string;
  public balance!: number ;
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
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        account_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        walletTtype: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        balance: {
          type: DataTypes.DOUBLE(10, 6),
          // type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue : 0
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_assets",
        paranoid: true,
      }
    );
  }
}

export default assetModel;
