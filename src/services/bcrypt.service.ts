import serviceBaseController from "./main.service";
import bcrypt from "bcrypt";

class bcryptService extends serviceBaseController {
  private slate: number = 10;
  private late_private = "s0//P4$$w0rD";

  /**
   * Creates a hashed version of the given password.
   * 
   * @param {string | Buffer} Password - The plain-text password to hash.
   * @returns {Promise<string>} - Returns a promise that resolves to the hashed password string.
   */
  MDB_crateHash = async (Password: string | Buffer): Promise<string> => {
    const salt = await bcrypt.genSalt(this.slate);
    const hash = await bcrypt.hash(Password, salt);
    return hash;
  };

  /**
   * Compares a plain-text password with a stored hash to check if they match.
   * 
   * @param {string} Password - The plain-text password provided by the user attempting to login.
   * @param {string} hash - The stored hashed password from the database.
   * @returns {boolean} - Returns true if the password matches the hash, false otherwise.
   */
  MDB_compareHash = (Password: any, hash: any): boolean => {
    return bcrypt.compareSync(Password, hash); // true
  };
}

export default  bcryptService;
