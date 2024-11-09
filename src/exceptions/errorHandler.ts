import { logger } from "./Logger";
enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

/**
* A custom error class that extends the built-in Error class for more structured error handling.
* 
* @class
* @extends Error
*/
class BaseError extends Error {
  /**
  * The name of the error.
  * @type {string}
  */
  public readonly name: string;
  /**
   * The HTTP status code associated with the error.
   * @type {HttpStatusCode}
   */
  public readonly httpCode: HttpStatusCode;

  /**
   * Indicates whether the error is operational (user-related) or not.
   * @type {boolean}
   */
  public readonly isOperational: boolean;

  /**
   * Constructs a new `BaseError` instance.
   * 
   * @param {string} name - The name of the error.
   * @param {HttpStatusCode} httpCode - The HTTP status code for the error.
   * @param {string} description - A description of the error.
   * @param {boolean} isOperational - Whether the error is operational (i.e., expected and manageable).
   */
  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

/**
 * A specific error class for handling API errors that extends the `BaseError` class.
 * 
 * @class
 * @extends BaseError
 */
class APIError extends BaseError {
    /**
   * Constructs a new `APIError` instance.
   * 
   * @param {any} name - The name or identifier of the error.
   * @param {HttpStatusCode} [httpCode=HttpStatusCode.INTERNAL_SERVER] - The HTTP status code for the error, defaulting to 500.
   * @param {string} [description="internal server error"] - A description of the error, defaulting to "internal server error".
   * @param {boolean} [isOperational=true] - Whether the error is operational (i.e., expected and manageable), defaulting to `true`.
   */
  constructor(
    name: any,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    description = "internal server error",
    isOperational = true
  ) {
    super(name, httpCode, description, isOperational);
  }
}

/**
 * A centralized error-handling class for handling and determining the nature of errors.
 * 
 * @class
 */
class ErrorHandler {
    /**
   * Logs an error using a centralized logging system.
   * 
   * @param {Error} err - The error to be handled and logged.
   * @returns {Promise<void>} A promise that resolves after the error has been logged.
   * 
   * @description
   * This method logs the provided error message using a logger. It serves as a centralized
   * point for handling errors and can be extended to include additional error-handling
   * functionality, such as sending notifications or reporting to error-tracking services.
   */
  public async handleError(err: Error): Promise<void> {
    await logger.error(
      "Error message from the centralized error-handling component",
      err
    );
    //   await sendMailToAdminIfCritical();
    //   await sendEventsToSentry();
  }



  /**
   * Determines if an error is a trusted operational error.
   * 
   * @param {Error} error - The error to be checked.
   * @returns {boolean} `true` if the error is a trusted operational error, otherwise `false`.
   * 
   * @description
   * This method checks if the error is an instance of `BaseError` and verifies whether it is
   * marked as operational. Trusted errors are expected and manageable, whereas non-trusted
   * errors may indicate programming bugs or unhandled cases.
   */
  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
export const cerrorHandler = new ErrorHandler();

class HTTP400Error extends BaseError {
  constructor(description = 'bad request') {
    super('NOT FOUND', HttpStatusCode.BAD_REQUEST, description, true);
  }
}