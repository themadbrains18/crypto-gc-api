import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface transferhistoryAtteribute {
  id?: string;

  user_id?:string;
  from?:string;
  to?:string;
  token_id?:string;
  balance?:number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface transferhistoryInput
  extends Optional<transferhistoryAtteribute, "id"> {}
export interface transferhistoryOuput extends Required<transferhistoryAtteribute> {}

class transferhistoryModel
  extends Model<transferhistoryAtteribute, transferhistoryInput>
  implements transferhistoryAtteribute
{
  public id!: string;

  public user_id?:string;
  public from?:string;
  public to?:string;
  public token_id?:string;
  public balance?:number;

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
        user_id:{
          type: DataTypes.STRING,
          allowNull: false,
        },
        from: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        to :{
          type: DataTypes.STRING,
          allowNull: false,
        },
        token_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        balance:{
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue:0.0
        }

      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "transferhistory",
        paranoid: true,
      }
    );
  }
}

export default transferhistoryModel;
