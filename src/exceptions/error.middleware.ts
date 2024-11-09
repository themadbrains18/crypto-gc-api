import { Request, Response, NextFunction } from "express";
import {CustomError} from "./http-exception";
import multer from "multer";

/**
 * Middleware to handle errors in the application.
 * 
 * @param {CustomError} err - The error object, which may be an instance of CustomError.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * 
 * @description
 * This middleware function checks if the incoming error is an instance of `CustomError`.
 * If it is not, it wraps the error in a `CustomError` instance with a 500 status code.
 * Finally, it sends the custom error response to the client.
 */

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
   res.status((customError as CustomError).status).send(customError);
};
