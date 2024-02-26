import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface userRewardAtteribute {
    id?: string;
    user_id?: string;
    type?: string;
    amount: number;
    claim?: boolean;
    description?: string;
    claimed_on?: Date;
    expired_on?: Date;
    status?: boolean;
    coupan_code?: string;
    event_id?: string;
    event_type?: string;
    refer_user?: string;

    //timestamps!
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface userRewardInput extends Optional<userRewardAtteribute, "id"> { }
export interface userRewardOuput extends Required<userRewardAtteribute> { }

class userRewardModel extends Model<userRewardAtteribute, userRewardInput> implements userRewardAtteribute {
    public id!: string;
    public user_id!: string;
    public type!: string;
    public amount!: number;
    public claim!: boolean;
    public description!: string;
    public claimed_on!: Date;
    public expired_on!: Date;
    public status!: boolean;
    public coupan_code!: string;
    public event_id!: string;
    public event_type!: string;
    public refer_user!: string;

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
                amount: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                },
                claim: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                claimed_on: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                expired_on: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                coupan_code: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                event_id: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                event_type: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                refer_user: {
                    type: DataTypes.STRING,
                    allowNull: true,
                }
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "user_reward",
                paranoid: true,
            }
        );
    }
}

export default userRewardModel;
