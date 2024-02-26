import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface profileAtteribute {
    id?: string;
    user_id?: string;
    fName?: string;
    lName?: string;
    dName?: string;
    uName?: string;
    image?: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}


export interface profileInput extends Optional<profileAtteribute, "id"> { }
export interface profileOuput extends Required<profileAtteribute> { }

class profileModel
    extends Model<profileAtteribute, profileInput>
    implements profileAtteribute {
    public id!: string;
    public user_id!: string;
    public fName!: string;
    public lName!: string;
    public dName!: string;
    public uName!:string;
    public image!:string;

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
                fName: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                lName: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                dName: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                uName: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "profile",
                paranoid: true,
            }
        );
    }
}

export default profileModel;
