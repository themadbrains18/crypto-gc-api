import { json } from "sequelize";
import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface paymentAtteribute {
  id?: string;

  payment_method?: string;
  icon?: string;
  region?: string;
  fields?: object;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface paymentInput extends Optional<paymentAtteribute, "id"> {}
export interface paymentOuput extends Required<paymentAtteribute> {}

class paymentMethodModel
  extends Model<paymentAtteribute, paymentInput>
  implements paymentAtteribute
{
  public id!: string;
  public payment_method!: string;
  public icon!: string;
  public region!: string;
  public fields!: object;

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
        payment_method: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        icon: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        region: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fields: {
          type: DataTypes.JSON,
          allowNull: false,
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "master_payment_method",
        paranoid: true,
      }
    );
  }
}

export default paymentMethodModel;
