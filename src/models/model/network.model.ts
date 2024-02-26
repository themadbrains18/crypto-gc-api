import { Model, Optional, DataTypes, Sequelize, DataType } from "sequelize";

interface networkAtteribute {
  id?: string;
  symbol?: string;
  fullname?: string;
  network?: string;
  chainId?: number;
  rpcUrl?: string;
  BlockExplorerURL?:string;
  user_id?: string
  status? : boolean;
  walletSupport? : 'sol' | 'tron' | 'eth',
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface networkInput extends Optional<networkAtteribute, "id"> {}
export interface networkOuput extends Required<networkAtteribute> {}

class networkModel
  extends Model<networkAtteribute, networkInput>
  implements networkAtteribute
{
  public id!: string;
  public user_id!: string;
  public symbol!: string;
  public fullname!: string;
  public network!: string;
  public chainId!: number;
  public status!: boolean;
  public rpcUrl!: string;
  public BlockExplorerURL!:string;
  public walletSupport! :'sol' | 'tron' | 'eth';

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
        symbol: {
          type: DataTypes.STRING,
          allowNull: false,
          // unique: {
          //   name: "name",
          //   msg: 'Network name is already exist.' 
          // },
        },
        fullname: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            name: "fullname",
            msg: 'Network fullname is already exist.' 
          },
        },
        network: {
          type: DataTypes.ENUM("testnet","mainnet"),
          allowNull: false,
          defaultValue : 'mainnet'
        },
        walletSupport: {
          type: DataTypes.ENUM('sol','tron','eth'),
          allowNull: false,
          defaultValue : 'eth'
        },
        chainId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          unique: {
            name: "chainId",
            msg: 'chainId is already exist.' 
          },
        },
        BlockExplorerURL: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            name: "BlockExplorerURL",
            msg: 'Block Explorer URL is already exist.' 
          },
        },
        
        rpcUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          validate : {
            isUrl : true
          }
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue : false
        },
      },
      {
        timestamps: true,
        sequelize: sequelize,
        modelName: "networks",
        paranoid: true,
      }
    );
  }
}

export default networkModel;
