import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface stakingAtteribute {
  id?: string;
  user_id?: string;
  token_id?:string;
  amount?:number;
  apr?:number;
  time_log?:number;
  time_format?:string;
  status?:boolean;
  queue?:boolean;
  redeem?:boolean;
  unstacking?:boolean;
  //timestamps!
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface stakingInput extends Optional<stakingAtteribute, "id"> {}
export interface stakingOuput extends Required<stakingAtteribute> {}

class stakingModel extends Model<stakingAtteribute, stakingInput> implements stakingAtteribute {
  public id!: string;

  public user_id!: string;
  public token_id!: string;
  public amount!: number;
  public apr!: number;
  public time_log!: number;
  public time_format!: string;
  public status!: boolean;
  public queue!: boolean;
  public redeem!: boolean;
  public unstacking!:boolean;

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
          defaultValue: "",
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        apr: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        time_log: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        time_format: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue:false
        },
        queue: {
          type: DataTypes.BOOLEAN,
          defaultValue:false
        },
        redeem: {
          type: DataTypes.BOOLEAN,
          defaultValue:false
        },
        unstacking:{
          type: DataTypes.BOOLEAN,
          defaultValue:false
        }
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "user_staking",
        paranoid: true,
      }
    );
  }
}

export default stakingModel;
