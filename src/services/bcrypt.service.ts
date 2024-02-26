import serviceBaseController from "./main.service";
import bcrypt from "bcrypt";

class bcryptService extends serviceBaseController {
  private slate: number = 10;
  private late_private = "s0//P4$$w0rD";

  /**
   *
   * @param Password noraml pass encrypt into hash
   * @returns
   */

  MDB_crateHash = async (Password: string | Buffer): Promise<string> => {
    const salt = await bcrypt.genSalt(this.slate);
    const hash = await bcrypt.hash(Password, salt);
    return hash;
  };

  /**
   *
   * @param Password this text provided by user when he attempt to login
   * @param hash which pass is stored in your database
   */

  MDB_compareHash = (Password: any, hash: any): boolean => {
    return bcrypt.compareSync(Password, hash); // true
  };
}

export default  bcryptService;
