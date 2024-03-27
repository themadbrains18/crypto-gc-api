import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface addressAtteribute {
  id?: string;
  label?: string;
  address?: string;
  networkId?: string;
  user_id?: string
  status? : boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface addressInput extends Optional<addressAtteribute, "id"> {}
export interface addressOuput extends Required<addressAtteribute> {}

class addressModel
  extends Model<addressAtteribute, addressInput>
  implements addressAtteribute
{
  public id!: string;
  public user_id!: string;
  public label!: string;
  public address!: string;
  public networkId!: string;
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
        label: {
          type: DataTypes.STRING,
          allowNull: false,
          // unique: {
          //   name: "name",
          //   msg: 'Network name is already exist.' 
          // },
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            name: "address",
            msg: 'Address is already exist.' 
          },
        },
        networkId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue : false
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "address",
        paranoid: true,
      }
    );
  }
}

export default addressModel;
