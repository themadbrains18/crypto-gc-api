import { logger } from "./Logger";
 enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
   }

class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

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

//free to extend the BaseError
class APIError extends BaseError {
  constructor(
    name: any,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    description = "internal server error",
    isOperational = true
  ) {
    super(name, httpCode, description,isOperational);
  }
}

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await logger.error(
      "Error message from the centralized error-handling component",
      err
    );
    //   await sendMailToAdminIfCritical();
    //   await sendEventsToSentry();
  }

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