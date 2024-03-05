"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_exception_1 = require("./http-exception");
const errorHandler = (err, req, res, next) => {
    let customError = err;
    if (!(err instanceof http_exception_1.CustomError)) {
        customError = new http_exception_1.CustomError(500, `Oh no, this is embarrasing. We are having troubles my friend`);
    }
    customError.message = err;
    // we are not using the next function to prvent from triggering
    // the default error-handler. However, make sure you are sending a
    // response to client to prevent memory leaks in case you decide to
    // NOT use, like in this example, the NextFunction .i.e., next(new Error())
    res.status(customError.status).send(customError);
};
exports.errorHandler = errorHandler;
