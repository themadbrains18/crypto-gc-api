"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cerrorHandler = void 0;
const Logger_1 = require("./Logger");
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
})(HttpStatusCode || (HttpStatusCode = {}));
class BaseError extends Error {
    name;
    httpCode;
    isOperational;
    constructor(name, httpCode, description, isOperational) {
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
    constructor(name, httpCode = HttpStatusCode.INTERNAL_SERVER, description = "internal server error", isOperational = true) {
        super(name, httpCode, description, isOperational);
    }
}
class ErrorHandler {
    async handleError(err) {
        await Logger_1.logger.error("Error message from the centralized error-handling component", err);
        //   await sendMailToAdminIfCritical();
        //   await sendEventsToSentry();
    }
    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
exports.cerrorHandler = new ErrorHandler();
class HTTP400Error extends BaseError {
    constructor(description = 'bad request') {
        super('NOT FOUND', HttpStatusCode.BAD_REQUEST, description, true);
    }
}
