import { string } from "joi";
import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface tokenListingAttribute {
    id?: string;
    user_id?: string;
    name?: string;
    symbol?: string;
    logo?: string;
    issue_price?: number;
    issue_date?: Date;
    decimals?: number;
    fees?: number;
    max_supply?: number;
    circulating_supply?: number;
    explore_link?: string;
    white_pp_link?: string;
    website_link?: string;
    introduction?: Text;
    network?: object;
    status?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface tokenListingInput extends Optional<tokenListingAttribute, "id"> { }
export interface tokenListingOuput extends Required<tokenListingAttribute> { }

class tokenListingModel
    extends Model<tokenListingAttribute, tokenListingInput>
    implements tokenListingAttribute {
    public id!: string;
    public user_id!: string;
    public name!: string;
    public symbol!: string;
    public logo!: string;
    public issue_price!: number;
    public issue_date!: Date;
    public decimals!: number;
    public fees!: number;
    public max_supply!: number;
    public circulating_supply!: number;
    public explore_link!: string;
    public white_pp_link!: string;
    public website_link!: string;
    public introduction!: Text;
    public network!: object;
    public status!: boolean;

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
                user_id :{
                    type: DataTypes.STRING,
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                symbol: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                logo: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                issue_price: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                issue_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                decimals: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                fees: {
                    type: DataTypes.DOUBLE,
                    allowNull: true
                },
                max_supply: {
                    type: DataTypes.DOUBLE,
                    allowNull: true
                },
                circulating_supply: {
                    type: DataTypes.DOUBLE,
                    allowNull: true
                },
                explore_link: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                white_pp_link: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                website_link: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                introduction: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                network: {
                    type: DataTypes.JSON,
                    allowNull: false
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                }

            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "tokens_list",
                paranoid: true,
            }
        )
    }
}

export default tokenListingModel;