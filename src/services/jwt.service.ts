import { object } from "joi";
import { Request } from "express";
import serviceBaseController from "./main.service";
import jwt from "jsonwebtoken";

class jwt_token extends serviceBaseController {
  protected privateKey =
    process.env.TOKEN_KEY ||
    "$2b$10$oy2o.eHnBE1bZMyAkj4GQ.j0nT4ceDBNU7PZ71Tjp19Mpwf0.NGlW";

      /**
   * Signs the provided object as a JWT token.
   * 
   * This method generates a signed JWT token from the provided object. It can also
   * accept an optional expiration time for the token. If not provided, the default 
   * expiration time is set to 5 hours.
   * 
   * @param {object} obj - The object to be signed as the JWT payload.
   * @param {string} [expireTime="5h"] - Optional expiration time for the token. Default is "5h".
   * @returns {string} - The signed JWT token.
   */
  sign = (obj: object, expireTime?: string): string => {
    let time = !!expireTime ? expireTime : "5h";
    let token = jwt.sign(obj, this.privateKey, {
      expiresIn: time,
    });

    return token;
  };

  /**
   * Verifies the given JWT token.
   * 
   * This method verifies the authenticity of the provided JWT token using the 
   * private key. If the token is valid, it returns the decoded user information.
   * Otherwise, it returns an error message.
   * 
   * @param {string} token - The JWT token to be verified.
   * @returns {any} - Returns the decoded user information if valid or an error message if invalid.
   */
  verify (token: string) : any {
    try {
      
     return jwt.verify(token, this.privateKey, (err, user) => {
        if (err) {
          return {"status":404, "message" : "err.message"}
          // throw new Error(err.message);
        }
        
        return user;
      });
    } catch (error: any) {
      return error.message;
    }
  };
}

export default jwt_token;
