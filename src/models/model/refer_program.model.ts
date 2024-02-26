import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface referProgramAtteribute {
    id?: string;
    user_id?: string;
    name?: string;
    description?: string;
    amount?: number;
    token_id?: string;
    status?: boolean;
    start_date?: Date;
    end_date?: Date;

    //timestamps!
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface referProgramInput extends Optional<referProgramAtteribute, "id"> { }
export interface referProgramOuput extends Required<referProgramAtteribute> { }

class referProgramModel extends Model<referProgramAtteribute, referProgramInput> implements referProgramAtteribute {
    public id!: string;
    public user_id!: string;
    public name!: string;
    public description!: string;
    public amount!: number;
    public token_id!: string;
    public status!: boolean;
    public start_date!: Date;
    public end_date!: Date;

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
                name: {
                    type: DataTypes.STRING,
                    defaultValue: "",
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                amount: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                token_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                start_date: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW
                },
                end_date: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW
                }

            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "refer_program",
                paranoid: true,
            }
        );
    }
}

export default referProgramModel;
