import multer, { FileFilterCallback , DiskStorageOptions} from 'multer';
import path from 'path';

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

       /**
     * Path where uploaded files are stored.
     * @type {string}
     */

    filepath = "../uploads/";

    

    // constructor (filepath : string){
    //     this.filepath = filepath 
     
    // }

      /**
     * Disk storage configuration for file uploads.
     * 
     * - Sets the destination directory for storing the uploaded files.
     * - Generates a unique filename for each uploaded file by appending a timestamp and a random number.
     * 
     * @type {DiskStorageOptions}
     */

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
          
            cb(null, path.resolve('../uploads/'))
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '-' + uniqueSuffix)
        }
      })
      
       /**
     * Multer upload instance with storage configuration.
     * 
     * This is used to handle the file upload process using the storage options defined above.
     * 
     * @type {multer.Instance}
     */
    upload = multer({ storage: this.storage })

       /**
     * File filter function to validate file types.
     * 
     * This method checks if the uploaded file is a valid image type (png, jpg, jpeg).
     * If the file type is valid, the file is accepted; otherwise, it is rejected.
     * 
     * @param {Request} request - The Express request object.
     * @param {Express.Multer.File} file - The uploaded file.
     * @param {FileFilterCallback} callback - The callback function to indicate if the file should be accepted or rejected.
     * 
     * @returns {void} - Calls the callback with either `true` (accept) or `false` (reject) based on the file's mime type.
     */
    fileFilter(
        request: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback
    ){
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
}

export default fileUploadService;