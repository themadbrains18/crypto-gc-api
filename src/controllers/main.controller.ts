
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






  /**
 * Middleware function to validate request bodies using a given Joi schema.
 * 
 * @param {Joi.ObjectSchema} validationObject - The Joi schema used for validating the request body.
 * @returns {Function} An Express middleware function that validates the request body.
 * 
 * @description
 * This middleware checks if the request URL matches specific endpoints and transforms the 
 * `network` or `networks` fields into arrays by parsing JSON strings. Then, it validates 
 * the request body against the provided Joi schema. If validation fails, a 422 response is 
 * returned with the validation error message. For other errors, a 500 response is returned.
 */
  Validator(validationObject: Joi.ObjectSchema) {
    
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      
      
      try {
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

/**
 * Sends a JSON response with a given status code and message.
 * 
 * @param {express.Response} res - The Express response object.
 * @param {number} code - The HTTP status code to send.
 * @param {string} message - The message to include in the response body.
 * @returns {express.Response} The Express response object.
 */
  public static jsonResponse(
    res: express.Response, code: number, message: string
  ) {
    return res.status(code).json({ message })
  }


  /**
   * Sends an HTTP 200 OK response, optionally with a JSON body.
   * 
   * @template T
   * @param {express.Response} res - The Express response object.
   * @param {T} [dto] - The data transfer object to include in the response body.
   * @returns {express.Response} The Express response object.
   * 
   * @description
   * If a `dto` is provided, the response is sent as JSON. Otherwise, an empty 200 status is returned.
   */

  public ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  /**
   * Sends an HTTP 201 Created response, optionally with a JSON body.
   * 
   * @template T
   * @param {express.Response} res - The Express response object.
   * @param {T} [dto] - The data transfer object to include in the response body.
   * @returns {express.Response} The Express response object.
   * 
   * @description
   * If a `dto` is provided, the response is sent as JSON. Otherwise, an empty 201 status is returned.
   */
  public created<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(201).json(dto);
    } else {
      return res.sendStatus(201);
    }
  }



  /**
   * Sends an HTTP 400 Bad Request response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */
  public clientError(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 400, message ? message : 'Unauthorized');
  }



  
  /**
   * Sends an HTTP 401 Unauthorized response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */
  public unauthorized(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 401, message ? message : 'Unauthorized');
  }


  /**
   * Sends an HTTP 402 Payment Required response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */

  public paymentRequired(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 402, message ? message : 'Payment required');
  }



  /**
   * Sends an HTTP 403 Forbidden response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */
  public forbidden(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 403, message ? message : 'Forbidden');
  }



  /**
   * Sends an HTTP 404 Not Found response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */
  public notFound(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
  }



  /**
   * Sends an HTTP 409 Conflict response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */
  public conflict(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 409, message ? message : 'Conflict');
  }

  /**
   * Sends an HTTP 429 Too Many Requests response with an optional message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {string | any} [message] - The optional message to include in the response.
   * @returns {express.Response} The Express response object.
   */
  public tooMany(res: express.Response, message?: string | any) {
    return BaseController.jsonResponse(res, 429, message ? message : 'Too many requests');
  }


  /**
   * Sends an HTTP 400 Bad Request response with a default 'TODO' message.
   * 
   * @param {express.Response} res - The Express response object.
   * @returns {express.Response} The Express response object.
   */
  public todo(res: express.Response) {
    return BaseController.jsonResponse(res, 400, 'TODO');
  }

    
  /**
   * Sends an HTTP 500 Internal Server Error response with the error message.
   * 
   * @param {express.Response} res - The Express response object.
   * @param {Error | string | Object} error - The error to log and include in the response.
   * @returns {express.Response} The Express response object.
   */

  public fail(res: express.Response, error: Error | string | Object) {
    console.log(error);
    return res.status(500).json({
      message: error.toString()
    })
  }

}