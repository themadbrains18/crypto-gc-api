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

    filepath = "../uploads/";

    

    // constructor (filepath : string){
    //     this.filepath = filepath 
     
    // }


    storage = multer.diskStorage({
        destination: function (req, file, cb) {
          
            cb(null, path.resolve('../uploads/'))
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '-' + uniqueSuffix)
        }
      })
      
    upload = multer({ storage: this.storage })

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