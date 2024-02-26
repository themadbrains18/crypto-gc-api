import { Model, Optional, DataTypes, Sequelize, DataType, Association } from "sequelize";

interface chatAtteribute {
  id?: string;
  post_id?: string;
  sell_user_id?: string;
  buy_user_id?: string;
  orderid?: string;
  chat?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface chatInput extends Optional<chatAtteribute, "id"> {}
export interface chatOuput extends Required<chatAtteribute> {}

class chatModel
  extends Model<chatAtteribute, chatInput>
  implements chatAtteribute
{
  public id!: string;
  public post_id!: string;
  public sell_user_id!: string;
  public buy_user_id!: string;
  public orderid!: string;
  public chat!: string;
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
        post_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sell_user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        buy_user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chat: {
            type: DataTypes.JSON,
            allowNull: false
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_p2p_chat",
        paranoid: true,
      }
    );
  }

  public static associations: { [key: string]: Association<Model<any, any>, Model<any, any>>; };
  
}



export default chatModel;
