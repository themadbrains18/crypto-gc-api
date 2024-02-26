import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface watchlistAtteribute {
  id?: string;
  user_id?: string;
  token_id?:string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface watchlistInput extends Optional<watchlistAtteribute, "id"> {}
export interface watchlistOuput extends Required<watchlistAtteribute> {}

class watchlistModel
  extends Model<watchlistAtteribute, watchlistInput>
  implements watchlistAtteribute
{
  public id!: string;
  public user_id!: string;
  public token_id!: string;

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
          }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_watchlist",
        paranoid: true,
      }
    );
  }
}

export default watchlistModel;
