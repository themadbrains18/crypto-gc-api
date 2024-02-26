import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface siteMaintenanceAttribute {
  id?: string;
  title?: string;
  message?: string;
  down_status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}


export interface siteMaintenanceInput extends Optional<siteMaintenanceAttribute, "id"> { }
export interface siteMaintenanceOuput extends Required<siteMaintenanceAttribute> { }

class siteMaintenanceModel
  extends Model<siteMaintenanceAttribute, siteMaintenanceInput>
  implements siteMaintenanceAttribute {
  public id!: string;
  public title!: string;
  public message!: string;
  public down_status!: boolean;
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        down_status: {
          type: DataTypes.BOOLEAN,
          defaultValue : false
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "sitemaintenance",
        paranoid: true,
      }
    );
  }
}

export default siteMaintenanceModel;
