import { Request, Response, NextFunction } from "express";
import {CustomError} from "./http-exception";
import multer from "multer";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError(500,
      `Oh no, this is embarrasing. We are having troubles my friend`
    );
  }
  customError.message = err
   // we are not using the next function to prvent from triggering
  // the default error-handler. However, make sure you are sending a
  // response to client to prevent memory leaks in case you decide to
  // NOT use, like in this example, the NextFunction .i.e., next(new Error())
   res.status((customError as CustomError).status).send(customError);
};
