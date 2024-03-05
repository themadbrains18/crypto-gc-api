"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
class fileUploadService {
    // fileStorage = multer.diskStorage({
    //     destination: (
    //         request: Request,
    //         file: Express.Multer.File,
    //         callback: DestinationCallback
    //     ): void => {
    //         // ...Do your stuff here.
    //     },
    //     filename: (
    //         req: Request, 
    //         file: Express.Multer.File, 
    //         callback: FileNameCallback
    //     ): void => {
    //         // ...Do your stuff here.
    //     }
    // });
    filepath = "../uploads/";
    // constructor (filepath : string){
    //     this.filepath = filepath 
    // }
    storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path_1.default.resolve('../uploads/'));
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    });
    upload = (0, multer_1.default)({ storage: this.storage });
    fileFilter(request, file, callback) {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    }
}
exports.default = fileUploadService;
