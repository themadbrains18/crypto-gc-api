import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface profitLossAtteribute {
    id?: string;
    contract?: string;
    position_id?: string;
    user_id?: string;
    qty?: string;
    trigger_profit?: number;
    trigger_loss?: number;
    profit_value?: number;
    loss_value?: number;
    trade_type?: string;
    isClose?:boolean;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}


export interface profitLossInput extends Optional<profitLossAtteribute, "id"> { }
export interface profitLossOuput extends Required<profitLossAtteribute> { }

class takeProfitStopLossModel
    extends Model<profitLossAtteribute, profitLossInput>
    implements profitLossAtteribute {
    public id!: string;
    public contract!: string;
    public position_id!: string;
    public user_id!: string;
    public qty!: string;
    public trigger_profit!: number;
    public trigger_loss!: number;
    public profit_value!: number;
    public loss_value!: number;
    public trade_type!: string;
    public isClose!: boolean;

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
                user_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                contract: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                qty: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                trigger_profit: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0.00,
                    allowNull: true,
                },
                trigger_loss: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0.00,
                    allowNull: true,
                },
                profit_value: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0.00,
                    allowNull: true,
                },
                loss_value: {
                    type: DataTypes.DOUBLE,
                    defaultValue: 0.00,
                    allowNull: true,
                },
                trade_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isClose: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "profitloss",
                paranoid: true,
            }
        );
    }
}

export default takeProfitStopLossModel;
