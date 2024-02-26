import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface userNotificationAtteribute {
    id: string;

    user_id?: string;
    type?: string;
    message?: object;
    status?: boolean;
    url?:string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface userNotificationInput
    extends Optional<userNotificationAtteribute, "id"> { }
export interface userNotificationOuput extends Required<userNotificationAtteribute> { }

class userNotificationModel
    extends Model<userNotificationAtteribute, userNotificationInput>
    implements userNotificationAtteribute {
    public id!: string;

    public user_id!: string;
    public type!: string;
    public message!: object;
    public status!: boolean;
    public url!:string;    

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
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                message: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },

            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "user_notifications",
                paranoid: true,
            }
        );
    }
}

export default userNotificationModel;
