import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface AdminPayFeesAtteribute {
    id?: string;

    deposit_id?: string;
    trx_hash?: string;
    user_address?: string;
    fees?: number;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface AdminPayFeesInput
    extends Optional<AdminPayFeesAtteribute, "id"> { }
export interface AdminPayFeesOuput extends Required<AdminPayFeesAtteribute> { }

class AdminPayFeesModel
    extends Model<AdminPayFeesAtteribute, AdminPayFeesInput>
    implements AdminPayFeesAtteribute {
    public id!: string;

    public deposit_id!: string;
    public trx_hash!: string;
    public user_address!: string;
    public fees!: number;

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
                deposit_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                trx_hash: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                user_address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                fees: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                    defaultValue: 0,
                },

            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "admin_pay_fees",
                paranoid: true,
            }
        );
    }
}

export default AdminPayFeesModel;
