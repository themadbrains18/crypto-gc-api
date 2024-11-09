export const responseCodes = {
  ok: 200,
  created: 201,
  processError: 400,
  notfound: 404,
  serverError: 500,
  unauthorized: 401,
  forbidden: 403,
  invalidCRSF: 419,
  invalidData: 422,
  unknownError: 520,
};
import * as express from 'express'

/**
 * A custom error class that extends the built-in `Error` class, designed for use in Express applications.
 * 
 * @class
 * @extends Error
 */
class CustomError extends Error {
  status: number;
  additionalInfo!: any;
  res! : express.Response
  message: string | any; 


    /**
   * Constructs a new `CustomError` instance.
   * 
   * @param {number} [status=500] - The HTTP status code for the error, defaulting to 500.
   * @param {any} [additionalInfo={}] - Any additional information to include with the error.
   */
  constructor(status: number = 500,  additionalInfo : any = {}) {
    super();
    this.status = status;
    this.message = this.message;
    this.additionalInfo = additionalInfo;

  }
}


export { CustomError } ;