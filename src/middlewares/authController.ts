import { Response, Request, NextFunction } from "express";
import service from "../services/service";
import BaseController from "../controllers/main.controller";
import { userJwtTokenModel, userModel } from "../models";

interface seaaion {
  user_id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}


class authController extends BaseController {
  /**
   *
   * @param req
   * @param Res
   * @param next
   */
  async auth(req: Request, res: Response, next: NextFunction) {
    try {

      // console.log(req.headers["authorization"])
      const authHeader = 'Bearer' + ' ' + req.headers["authorization"];
      // const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token == null) return res.sendStatus(403);
      let reqToken = req.headers["authorization"];


      let reslt = await service.jwt.verify(token);

      if (reslt.status !== undefined && reslt.status === 404) {

        return super.fail(res, "Unuthorized User");
      }

      let previousToken = await userJwtTokenModel.findOne({ where: { token: reqToken, user_id: reslt?.user_id }, raw: true });

      // console.log("prev",previousToken);


      if (previousToken === null) {
        // console.log("here in error");

        return super.fail(res, "Unuthorized User");
      }
      req.headers.user = reslt;
      req.body.user_id = reslt.user_id
      next();
    } catch (error) {
      // console.log(error,"==shdkjh");

      next(error);
    }
  }

  /**
   * 
   * @param permittedRoles 
   * @returns 
   */
  permit =
    (...permittedRoles: any[]) =>
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          let { user }: any = req.headers;

          if (user === undefined || user === null)
            return res.status(403).json({ message: "Forbidden" }); // user is forbidden

          if (user && permittedRoles.includes(user?.role)) {
            let matchRole: any = await userModel.findByPk(user?.user_id, {
              raw: true,
            });

            //  check if user account is active or not
            if (!matchRole.statusType)
              return res.status(403).json({ message: "Your account has been restricted. Please contact to administration." });

            if (matchRole?.role === user.role) {
              req.headers.info = matchRole;
              next(); // role is allowed, so continue on the next middleware
            } else {
              return res.status(403).json({ message: "Forbidden" }); // user is forbidden
            }
          } else {
            return res.status(403).json({
              message: "Forbidden, Sorry you do not have access to this route",
            }); // user is forbidden
          }
        } catch (error) {
          next(error);
        }
      };
}

export default authController;
