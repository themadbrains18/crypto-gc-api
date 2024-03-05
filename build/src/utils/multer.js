"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("./mime"));
// [
//   {
//     name: "idfront",
//     maxCount: 1,
//   },
//   {
//     name: "idback",
//     maxCount: 1,
//   },
//   {
//     name: "statement",
//     maxCount: 1,
//   }
// ]
class fileUpload {
    /**
     *
     * @param destination
     * @param field
     * @param filler
     */
    upload(destination = "/", fillter = ["jpg", "jpeg", "gif", "png"], maxSize = 2, images = []) {
        try {
            let fileSizes = maxSize * 1024 * 1024;
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            // storage path create
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //  if folder dos'nt exist then create new
            let path = process.cwd() + "/public/" + destination;
            if (!fs_1.default.existsSync(path)) {
                fs_1.default.mkdirSync(path, { recursive: true });
            }
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            // create a disc stroge by multer
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            let storage = multer_1.default.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    let extArray = file.mimetype.split("/");
                    let extension = extArray[extArray.length - 1];
                    // req.body.idfront = file.fieldname
                    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
                },
            });
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            // filter implemented if added when upload used for specfic routes
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            let uploadFilter = (req, file, cb) => {
                let message = [];
                // Routes desisered mime
                let desire = [];
                for (let [key, val] of Object.entries(mime_1.default)) {
                    if (fillter.includes(key)) {
                        desire.push(val);
                        message.push(`${val} or ${key} `);
                    }
                }
                if (desire.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    console.log("Invalid upload: fieldname should be ", message.join(" | "));
                    req.fileValidationError = `Invalid upload: fieldname should be ${message.join(" | ")}`;
                    return cb(req.fileValidationError, false);
                }
            };
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            // filter implemented if added when upload used for specfic routes
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
            return (0, multer_1.default)({
                storage: storage,
                limits: { fileSize: fileSizes },
                fileFilter: uploadFilter,
            }).fields(images);
            // if (fillter.length > 0) {
            // } else {
            //   return multer({
            //     storage: storage,
            //     limits: { fileSize: fileSizes },
            //   }).single("idback");
            // }
        }
        catch (error) {
            return error;
            console.log(error, "problem is here...");
        }
    }
}
exports.default = fileUpload;
