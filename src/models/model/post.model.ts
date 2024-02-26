import { json } from "sequelize";
import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface postAtteribute {
  id?: string;

  user_id?: string;
  token_id?: string;
  price?: number;
  quantity?: number;
  min_limit?: number;
  max_limit?: number;
  p_method?: object;
  payment_time?: string;
  notes?: string;
  checked?: boolean;
  status?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface postInput extends Optional<postAtteribute, "id"> {}
export interface postOuput extends Required<postAtteribute> {}

class postModel
  extends Model<postAtteribute, postInput>
  implements postAtteribute
{
  public id!: string;
  public user_id!: string;
  public token_id!: string;
  public price!: number;
  public quantity!: number;
  public min_limit!: number;
  public max_limit!: number;
  public p_method!: object;
  public payment_time!: string;
  public notes!: string;
  public checked!: boolean;
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
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        min_limit: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        max_limit: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        p_method: {
          type: DataTypes.JSON,
        },
        payment_time: {
          type: DataTypes.STRING,
        },
        notes: {
          type: DataTypes.STRING,
        },
        checked: {
          type: DataTypes.BOOLEAN,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_post",
        paranoid: true,
      }
    );
  }
}

export default postModel;
