import express, { Application, json, urlencoded, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../src/swagger/swagger.json";
import useragent  from 'express-useragent'
import requestIp   from 'request-ip'

// hello
export default class Server {
  constructor(app: Application) {
    this.middlewares(app);
    new routes(app);
  }

  private middlewares(app: Application) {
    // create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(
      path.join(__dirname, "access.log"),
      { flags: "a" }
    );

    /**
     *  App Configuration
     */

    app.use(helmet());
    app.use(cors({
      origin: '*'
    }));

  

    app.use(
      morgan("combined", {
        stream: accessLogStream,
        skip: function (req, res) {
          return res.statusCode > 400;
        },
      })
    );
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(express.urlencoded({ extended: true }));

    app.use(useragent.express());
    app.use(requestIp.mw());
    // app.use("/", express.static(process.cwd(), 'public');
    // app.use('/', express.static(path.join(process.cwd(), './public')))
  
    var options: object = {
      customCss: ".swagger-ui .topbar { display: none }",
    };
    
   app.use('/tmbexchange', function(req,res) { 
     // console.log('dfgdhfghfj')
      res.json({'dfdjgfhdf':'sdfjshdgfsgdfghsdgf'})
   });
    
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, options)
    );
  }
}
