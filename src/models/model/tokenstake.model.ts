import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface tokenStakeAtteribute {
  id?: string;

  token_id?: string;
  minimum_amount?: number;
  apr?: number;
  lockTime?: object;
  status?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface tokenstakeInput extends Optional<tokenStakeAtteribute, "id"> {}
export interface tokenstakeOuput extends Required<tokenStakeAtteribute> {}

class tokenstakeModel
  extends Model<tokenStakeAtteribute, tokenstakeInput>
  implements tokenStakeAtteribute
{
  public id!: string;

  public token_id!: string;
  public minimum_amount!: number;
  public apr!: number;
  public lockTime!: object;
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
        token_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        minimum_amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        apr: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        lockTime: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "token_stake",
        paranoid: true,
      }
    );
  }
}

export default tokenstakeModel;
