import { Model, Optional, DataTypes, Sequelize } from "sequelize";
import roles from "../../middlewares/_helper/roles";

interface UsersJwtTokenAttributes {
  id: string;
  user_id?: string;
  token?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserInput extends Optional<UsersJwtTokenAttributes, "id"> {}  
export interface UserOuput extends Required<UsersJwtTokenAttributes> {}

class userJwtTokenModel
  extends Model<UsersJwtTokenAttributes, UserInput>
  implements UsersJwtTokenAttributes
{
  public id!: string;
  public user_id!: string;
  public token!: string;
  
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
        token: {
          type: DataTypes.STRING(5000),
          allowNull: false,
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "users_jwt_token",
        paranoid: true,
      }
    );
  }
}

export default userJwtTokenModel;