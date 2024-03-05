"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class BaseController {
    /**
     * This is the implementation that we will leave to the
     * subclasses to figure out.
     */
    //   protected abstract executeImpl (
    //     req: express.Request, res: express.Response
    //   ): Promise<void | any>;
    //   /**
    //    * This is what we will call on the route handler.
    //    * We also make sure to catch any uncaught errors in the
    //    * implementation.
    //    */
    //   public async execute (
    //     req: express.Request, res: express.Response
    //   ): Promise<void> {
    //     try {
    //       await this.executeImpl(req, res);
    //     } catch (err) {
    //       console.log(`[BaseController]: Uncaught controller error`);
    //       console.log(err);
    //       this.fail(res, 'An unexpected error occurred')
    //     }
    //   }
    Validator(validationObject) {
        return async (req, res, next) => {
            try {
                if (req.originalUrl === '/tmbexchange/payment/save') {
                    let fieldArray = [];
                    for (let filed of req.body.fields) {
                        fieldArray.push(JSON.parse(filed));
                    }
                    req.body.fields = fieldArray;
                }
                if (req.originalUrl === '/tmbexchange/token/token_list/create') {
                    let networkArray = [];
                    for (let filed of req.body.network) {
                        networkArray.push(JSON.parse(filed));
                    }
                    req.body.network = networkArray;
                }
                if (req.originalUrl === '/tmbexchange/token/create' || req.originalUrl === '/tmbexchange/token/edit') {
                    let networkArray = [];
                    let networkbody = JSON.parse(req.body.networks);
                    for (let filed of networkbody) {
                        networkArray.push(filed);
                    }
                    req.body.networks = networkArray;
                }
                await validationObject.validateAsync(req.body);
                next();
            }
            catch (error) {
                if (error instanceof joi_1.default.ValidationError) {
                    return res.status(422).send({ message: error.message });
                }
                console.error(error);
                return res
                    .status(500)
                    .send({ message: "Something went wrong during validation" });
            }
        };
    }
    static jsonResponse(res, code, message) {
        return res.status(code).json({ message });
    }
    ok(res, dto) {
        if (!!dto) {
            res.type('application/json');
            return res.status(200).json(dto);
        }
        else {
            return res.sendStatus(200);
        }
    }
    created(res, dto) {
        if (!!dto) {
            res.type('application/json');
            return res.status(201).json(dto);
        }
        else {
            return res.sendStatus(201);
        }
    }
    clientError(res, message) {
        return BaseController.jsonResponse(res, 400, message ? message : 'Unauthorized');
    }
    unauthorized(res, message) {
        return BaseController.jsonResponse(res, 401, message ? message : 'Unauthorized');
    }
    paymentRequired(res, message) {
        return BaseController.jsonResponse(res, 402, message ? message : 'Payment required');
    }
    forbidden(res, message) {
        return BaseController.jsonResponse(res, 403, message ? message : 'Forbidden');
    }
    notFound(res, message) {
        return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
    }
    conflict(res, message) {
        return BaseController.jsonResponse(res, 409, message ? message : 'Conflict');
    }
    tooMany(res, message) {
        return BaseController.jsonResponse(res, 429, message ? message : 'Too many requests');
    }
    todo(res) {
        return BaseController.jsonResponse(res, 400, 'TODO');
    }
    fail(res, error) {
        console.log(error);
        return res.status(500).json({
            message: error.toString()
        });
    }
}
exports.default = BaseController;
