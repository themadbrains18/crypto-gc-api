import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface referProgramInviteModelAtteribute {
    id?: string;
    user_id?: string;
    referProgram_id?:string;
    name?: string;
    description?: string;
    amount?: number;
    token_id?: string;
    referral_id?:string;
    type?:string;
    status?: boolean;
    deposit?: number;
    trade?: number;

    //timestamps!
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface referProgramInviteInput extends Optional<referProgramInviteModelAtteribute, "id"> { }
export interface referProgramInviteOuput extends Required<referProgramInviteModelAtteribute> { }

class referProgramInviteModel extends Model<referProgramInviteModelAtteribute, referProgramInviteInput> implements referProgramInviteModelAtteribute {
    public id!: string;
    public user_id!: string;
    public referProgram_id!:string;
    public name!: string;
    public description!: string;
    public amount!: number;
    public token_id!: string;
    public referral_id!: string;
    public type!: string;
    public status!: boolean;
    public deposit!: number;
    public trade!: number;

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
                referProgram_id:{
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
                referral_id:{
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                type:{
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
                deposit: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                trade: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "refer_program_invite",
                paranoid: true,
            }
        );
    }
}

export default referProgramInviteModel;
