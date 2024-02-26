import { object } from "joi";
import { Request } from "express";
import serviceBaseController from "./main.service";
import jwt from "jsonwebtoken";

class jwt_token extends serviceBaseController {
  protected privateKey =
    process.env.TOKEN_KEY ||
    "$2b$10$oy2o.eHnBE1bZMyAkj4GQ.j0nT4ceDBNU7PZ71Tjp19Mpwf0.NGlW";

  sign = (obj: object, expireTime?: string): string => {
    let time = !!expireTime ? expireTime : "5h";
    let token = jwt.sign(obj, this.privateKey, {
      expiresIn: time,
    });

    return token;
  };

  /**
   *
   * @param token if function will return any demon key word it means error in function
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
