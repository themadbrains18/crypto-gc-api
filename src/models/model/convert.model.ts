import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface convertAtteribute {
  id?: string;
  converted?: string;
  received?: string;
  fees?: number;
  conversion_rate?: string;
  user_id?:string;
  
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface convertInput extends Optional<convertAtteribute, "id"> {}
export interface convertOuput extends Required<convertAtteribute> {}

class convertModel
  extends Model<convertAtteribute, convertInput>
  implements convertAtteribute
{
  public id!: string;

  public converted!: string;
  public received!: string;
  public fees!: number;
  public conversion_rate!: string;
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
        converted: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        received: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fees: {
          type: DataTypes.DOUBLE,
          defaultValue :0
        },
        conversion_rate: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id:{
            type :DataTypes.STRING,
            allowNull:false
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_convert",
        paranoid: true,
      }
    );
  }
}

export default convertModel;
