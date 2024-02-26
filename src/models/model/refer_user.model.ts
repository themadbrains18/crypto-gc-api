import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface referUserAtteribute {
    id?: string;
    user_id?: string;
    referral_user?: string;
    event_id?: string;

    //timestamps!
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface referUserInput extends Optional<referUserAtteribute, "id"> { }
export interface referUserOuput extends Required<referUserAtteribute> { }

class referUserModel extends Model<referUserAtteribute, referUserInput> implements referUserAtteribute {
    public id!: string;
    public user_id!: string;
    public referral_user!: string;
    public event_id!: string;

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
                referral_user: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                event_id: {
                    type: DataTypes.STRING,
                    allowNull: true,
                }
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "refer_user",
                paranoid: true,
            }
        );
    }
}

export default referUserModel;
