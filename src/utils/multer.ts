import { Request, Express, NextFunction, Response } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import fs from "fs";
import mimeType from "./mime";
import { type } from "os";
import { CustomError } from "../exceptions/http-exception";
import { object } from "joi";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

type fileFormat = {
  name: string;
  maxCount : number
}



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
  upload(
    destination: string = "/",
    fillter: any[] = ["jpg", "jpeg", "gif","png"],
    maxSize: number = 2,
    images : fileFormat[] = []
  ): any {
    try {
      let fileSizes = maxSize * 1024 * 1024;

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      // storage path create
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

      //  if folder dos'nt exist then create new
      let path = process.cwd() + "/public/" + destination;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      // create a disc stroge by multer
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

      let storage = multer.diskStorage({
        destination: function (
          req: Request,
          file: Express.Multer.File,
          cb: DestinationCallback
        ): void {
          cb(null, path);
        },
       
        
        filename: function (
          req: Request,
          file: Express.Multer.File,
          cb: FileNameCallback
        ): void {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

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

      let uploadFilter = (
        req: any,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) => {
        let message = [];

        // Routes desisered mime
        let desire = [];
        for (let [key, val] of Object.entries(mimeType)) {
          if (fillter.includes(key)) {
            desire.push(val);
            message.push(`${val} or ${key} `);
          }
        }

        if (desire.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log("Invalid upload: fieldname should be ", message.join(" | "))
          req.fileValidationError = `Invalid upload: fieldname should be ${message.join(" | ")}`;
          return cb(req.fileValidationError, false);       
        }
      };

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      // filter implemented if added when upload used for specfic routes
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

    
      return  multer({
        storage: storage,
        limits: { fileSize: fileSizes },
        fileFilter: uploadFilter,
      }).fields(images)

     
      // if (fillter.length > 0) {
      // } else {
      //   return multer({
      //     storage: storage,
      //     limits: { fileSize: fileSizes },
      //   }).single("idback");
      // }
    } catch (error) {
      return error;
      console.log(error, "problem is here...");
    }
  }
}

export default fileUpload;
