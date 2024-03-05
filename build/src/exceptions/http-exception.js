"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.responseCodes = void 0;
exports.responseCodes = {
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
class CustomError extends Error {
    status;
    additionalInfo;
    res;
    message;
    constructor(status = 500, additionalInfo = {}) {
        super();
        this.status = status;
        this.message = this.message;
        this.additionalInfo = additionalInfo;
    }
}
exports.CustomError = CustomError;
