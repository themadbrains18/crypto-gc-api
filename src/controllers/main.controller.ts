
import * as express from 'express'
import Joi, { object } from 'joi'

export default abstract class BaseController {

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






  Validator(validationObject: Joi.ObjectSchema) {
    
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      
      
      try {
        if (req.originalUrl === '/tmbexchange/payment/save') {
          let fieldArray = [];
          for (let filed of req.body.fields) {
            fieldArray.push(JSON.parse(filed))
          }
          req.body.fields = fieldArray;
        }

        if (req.originalUrl === '/tmbexchange/token/token_list/create') {
          let networkArray = [];
          for (let filed of req.body.network) {
            networkArray.push(JSON.parse(filed))
          }
          req.body.network = networkArray;
        }

        if (req.originalUrl === '/tmbexchange/token/create' || req.originalUrl === '/tmbexchange/token/edit') {
          let networkArray = [];
          let networkbody = JSON.parse(req.body.networks);
          
          for (let filed of networkbody) {
            
            networkArray.push(filed)
          }
          req.body.networks = networkArray;
        }
        
        await validationObject.validateAsync(req.body);
        next();
      } catch (error) {
        if (error instanceof Joi.ValidationError) {
          return res.status(422).send({ message: error.message });
        }
        console.error(error);
        return res
          .status(500)
          .send({ message: "Something went wrong during validation" });
      }
    }
  }

  public static jsonResponse(
    res: express.Response, code: number, message: string
  ) {
    return res.status(code).json({ message })
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(201).json(dto);
    } else {
      return res.sendStatus(201);
    }
  }

  public clientError(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 400, message ? message : 'Unauthorized');
  }

  public unauthorized(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 401, message ? message : 'Unauthorized');
  }

  public paymentRequired(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 402, message ? message : 'Payment required');
  }

  public forbidden(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 403, message ? message : 'Forbidden');
  }

  public notFound(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
  }

  public conflict(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 409, message ? message : 'Conflict');
  }

  public tooMany(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 429, message ? message : 'Too many requests');
  }

  public todo(res: express.Response) {
    return BaseController.jsonResponse(res, 400, 'TODO');
  }

  public fail(res: express.Response, error: Error | string | Object) {
    console.log(error);
    return res.status(500).json({
      message: error.toString()
    })
  }



}