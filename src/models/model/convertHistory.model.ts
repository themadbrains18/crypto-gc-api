import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface convertHistoryAtteribute {
    id?: string;

    token_id?: string;
    type?: string;
    amount?: number;
    fees?: number;
    balance?: number;
    user_id?: string;
    convert_id?: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface convertHistoryInput extends Optional<convertHistoryAtteribute, "id"> { }
export interface convertHistoryOuput extends Required<convertHistoryAtteribute> { }

class convertHistoryModel
    extends Model<convertHistoryAtteribute, convertHistoryInput>
    implements convertHistoryAtteribute {
    public id!: string;

    public token_id!: string;
    public type!: string;
    public amount!: number;
    public fees!: number;
    public balance!: number;
    public user_id!: string;
    public convert_id!: string;

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
                token_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                amount: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0
                },
                fees: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0
                },
                balance: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0
                },
                user_id: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                convert_id: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "user_convert_history",
                paranoid: true,
            }
        );
    }
}

export default convertHistoryModel;
