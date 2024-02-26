import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface userPmethodAtteribute {
  id?: string;
  user_id?: string;
  pmid?: string;
  status?: string;
  pm_name?: string;
  pmObject?: object;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface userPmethodInput extends Optional<userPmethodAtteribute, "id"> {}
export interface userPmethodOuput extends Required<userPmethodAtteribute> {}

class userPmethodModel
  extends Model<userPmethodAtteribute, userPmethodInput>
  implements userPmethodAtteribute
{
  public id!: string;
  public user_id!: string;
  public pmid!: string;
  public status!: string;
  public pm_name!: string;
  public pmObject!: object;

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
        pmid: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["active", "hold"],
          allowNull: false,
        },
        pm_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        pmObject: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_payment_methods",
        paranoid: true,
      }
    );
  }
}

export default userPmethodModel;
