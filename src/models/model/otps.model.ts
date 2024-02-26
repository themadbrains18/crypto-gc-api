import { Model, Optional, DataTypes, Sequelize } from "sequelize";
interface UserOtpAttributes {
    id : string | number,
    otp? : string | number,
    username? : string | number,
    expire?: string | number | Date,
    token? : string
}


export interface UserInputOtp extends Optional<UserOtpAttributes, "id"> {}
export interface UserOuputOtp extends Required<UserOtpAttributes> {}

class userOtpModel extends Model<UserOtpAttributes, UserInputOtp> {
    public id! : number | string;
    public otp! : string | number;
    public username! : string | number;
    public expire!: string | number | Date;
    public token! : string;

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
            primaryKey: true
          },
          otp: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique : true
          },
          token: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          expire: {
            type: DataTypes.DATE,
            allowNull: true,
          },
        },
        {
            timestamps: true,
            sequelize: sequelize,
            modelName : "UsersOtp",
            paranoid: true,
          });
    }
}

export default userOtpModel