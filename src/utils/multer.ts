import { Request, Express, NextFunction, Response } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import fs from "fs";
import mimeType from "./mime";


// Defining types for callback functions and file format objects
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

type fileFormat = {
  name: string;
  maxCount : number // Maximum number of files allowed for a specific field
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

// The fileUpload class handles the file upload functionality
class fileUpload {
  
   /**
   * This function configures the multer upload middleware for file handling.
   * @param destination - The folder where files will be saved (default: '/')
   * @param fillter - Array of allowed file extensions (default: ['jpg', 'jpeg', 'gif', 'png'])
   * @param maxSize - The maximum allowed file size in MB (default: 2MB)
   * @param images - Array of objects specifying the fields and max count for each file field
   * @returns The multer upload middleware configured with the specified settings
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
      // Ensure the destination folder exists, create if it doesn't
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

      //  if folder dos'nt exist then create new
      let path = process.cwd() + "/public/" + destination;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      // Create multer disk storage configuration
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

      let storage = multer.diskStorage({
        destination: function (
          req: Request,
          file: Express.Multer.File,
          cb: DestinationCallback
        ): void {
          cb(null, path); // Save files to the defined path
        },
       
        // Generate a unique filename for each file (avoid overwriting)
        filename: function (
          req: Request,
          file: Express.Multer.File,
          cb: FileNameCallback
        ): void {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

          let extArray = file.mimetype.split("/"); // Extract file extension from mimetype
          let extension = extArray[extArray.length - 1];

       // Set the filename as 'fieldname-timestamp-random.extension'
          cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
        },
      });

     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      // File validation based on allowed mime types (file filter)
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

      let uploadFilter = (
        req: any,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) => {
        let message = [];

        // Find the desired mime types based on provided filters
        let desire = [];
        for (let [key, val] of Object.entries(mimeType)) {
          if (fillter.includes(key)) {
            desire.push(val);  // Add allowed mime types to the 'desire' array
            message.push(`${val} or ${key} `); // Prepare error message if validation fails
          }
        }

          // Check if file mimetype matches the allowed list

        if (desire.includes(file.mimetype)) {
          cb(null, true); // File is valid, proceed with the upload
        } else {
           // If the file type is invalid, set an error message
          console.log("Invalid upload: fieldname should be ", message.join(" | "))
          req.fileValidationError = `Invalid upload: fieldname should be ${message.join(" | ")}`;
          return cb(req.fileValidationError, false);       
        }
      };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
      // Return the multer middleware configured for handling multiple fields
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
