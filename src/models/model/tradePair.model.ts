import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface tradePairAttribute {
  id?: string;
  tokenOne?: string;
  tokenTwo?: string;
  status?: string;
  symbolOne?: string;
  symbolTwo?: string;
  maker?:number;
  taker?:number;
  min_trade?:number;
  limit_trade?:boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}


export interface tradePairInput extends Optional<tradePairAttribute, "id"> { }
export interface tradePairOuput extends Required<tradePairAttribute> { }

class tradePairModel
  extends Model<tradePairAttribute, tradePairInput>
  implements tradePairAttribute {
  public id!: string;
  public tokenOne!: string;
  public tokenTwo!: string;
  public symbolOne!: string;
  public symbolTwo!: string;
  public maker!:number;
  public taker!:number;
  public min_trade!:number;
  public status!: string;
  public limit_trade!:boolean;
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
        tokenOne: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tokenTwo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        symbolOne: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        symbolTwo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        maker: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        taker: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        min_trade: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        },
        limit_trade:{
          type : DataTypes.BOOLEAN,
          defaultValue : true
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "tradepair",
        paranoid: true,
      }
    );
  }
}

export default tradePairModel;
