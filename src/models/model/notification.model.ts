import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface notificationAtteribute {
  id: string;

  sender?: string;
  receiver?: string;
  type?: string;
  orderid?: string;
  status?: boolean;
  message?: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface notificationInput
  extends Optional<notificationAtteribute, "id"> {}
export interface notificationOuput extends Required<notificationAtteribute> {}

class notificationModel
  extends Model<notificationAtteribute, notificationInput>
  implements notificationAtteribute
{
  public id!: string;

  public sender!: string;
  public receiver!: string;
  public type!: string;
  public orderid!: string;
  public status!: boolean;
  public message!: string;

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
        sender: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        receiver: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        orderid: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue : false
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue:false
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "notifications",
        paranoid: true,
      }
    );
  }
}

export default notificationModel;
