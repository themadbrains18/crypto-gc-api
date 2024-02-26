import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface userRewardTotalAtteribute {
    id?: string;
    user_id?: string;
    amount?: number;
    order_amount?: number;

    //timestamps!
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface userRewardTotalInput extends Optional<userRewardTotalAtteribute, "id"> { }
export interface userRewardTotalOuput extends Required<userRewardTotalAtteribute> { }

class userRewardTotalModel extends Model<userRewardTotalAtteribute, userRewardTotalInput> implements userRewardTotalAtteribute {
    public id!: string;
    public user_id!: string;
    public amount!: number;
    public order_amount!: number;

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
                amount: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                },
                order_amount: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "user_reward_total",
                paranoid: true,
            }
        );
    }
}

export default userRewardTotalModel;
