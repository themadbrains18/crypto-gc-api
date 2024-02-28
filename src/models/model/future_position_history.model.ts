import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface futurePositionHistoryAttribute {
    id?: string;
    position_id?: string;
    symbol?: string;
    user_id?: string;
    coin_id?: string;
    market_price?: number;
    margin?: number;
    pnl?: number;
    realized_pnl?: number;
    status?: boolean;
    direction?: string;
    order_type?: string;
    market_type?: string;
    isDeleted?: boolean;
    qty?: number;
}


export interface futurePositionHistoryInput extends Optional<futurePositionHistoryAttribute, "id"> { }
export interface futurePositionHistoryOuput extends Required<futurePositionHistoryAttribute> { }

class futurePositionHistoryModel
    extends Model<futurePositionHistoryAttribute, futurePositionHistoryInput>
    implements futurePositionHistoryAttribute {
    public id!: string;
    public position_id!: string;
    public symbol!: string;
    public user_id!: string;
    public coin_id!: string;
    public market_price!: number;
    public status!: boolean;
    public direction!: string;
    public order_type!: string;
    public market_type!: string;
    public qty!: number;
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
                position_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                symbol: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                user_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                coin_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                market_price: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: true,
                },
                direction: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                order_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                market_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isDeleted: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: true,
                },
                qty: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                },
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "futurepositionhistory",
                paranoid: true,
            }
        );
    }
}

export default futurePositionHistoryModel;
