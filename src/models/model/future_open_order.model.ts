import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface futureOpenOrderAttribute {
    id?: string;
    position_id?: string;
    user_id?: string;
    symbol?: string;
    side?: string; // close long, close short, limit case : open long, open short
    type?: string; //e.g limit, take profit market, stop market
    time?: Date;
    amount?: string; // limit order amount, close position
    price_usdt?: number; // limit order price
    trigger?: string; // TP/SL posiotion amount , limit order --
    leverage?: number;
    market_price?: number;
    liq_price?: number;
    margin?: number;
    order_type?: string;
    leverage_type?: string;
    coin_id?: string;
    isDeleted?: boolean;
    qty?: number;
    isTrigger?: boolean;
    position_mode?: string;
    reduce_only?: string; // TP/SL case Yes, limit order No
    post_only?: string; //No
    status?: boolean;
    queue?: boolean;
}


export interface futureOpenOrderInput extends Optional<futureOpenOrderAttribute, "id"> { }
export interface futureOpenOrderOuput extends Required<futureOpenOrderAttribute> { }

class futureOpenOrderModel
    extends Model<futureOpenOrderAttribute, futureOpenOrderInput>
    implements futureOpenOrderAttribute {
    public id!: string;
    public position_id!: string;
    public position_mode!: string;
    public user_id!: string;
    public symbol!: string;
    public side!: string;
    public type!: string;
    public time!: Date;
    public amount!: string;
    public price_usdt!: number;
    public trigger!: string;
    public reduce_only!: string;
    public post_only!: string;
    public status!: boolean;
    public queue!: boolean;


    public leverage!: number;
    public market_price!: number;
    public liq_price!: number;
    public margin!: number;
    public order_type!: string;
    public leverage_type!: string;
    public coin_id!: string;
    public isDeleted!: boolean;
    public qty!: number;
    public isTrigger!: boolean;

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
                symbol: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                side: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                time: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: new Date()
                },
                amount: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price_usdt: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                },
                trigger: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                reduce_only: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                post_only: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: true,
                },
                leverage: {
                    type: DataTypes.DOUBLE,
                    allowNull: true,
                    defaultValue: 1
                },
                market_price: {
                    type: DataTypes.DOUBLE,
                    allowNull: true,
                },
                position_mode: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: "oneWay"
          
                },
                liq_price: {
                    type: DataTypes.DOUBLE,
                    allowNull: true,
                },
                margin: {
                    type: DataTypes.DOUBLE,
                    allowNull: true,
                    defaultValue: 0
                },
                order_type: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                leverage_type: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                coin_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isDeleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                },
                qty: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                },
                isTrigger: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                },
                queue: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                },
            },
            {
                timestamps: true,
                sequelize: sequelize,
                modelName: "futureopenorder",
                paranoid: true,
            }
        );
    }
}

export default futureOpenOrderModel;
