import express, { Application, json, urlencoded } from "express";
import morgan from "morgan";
import routes from "./routes";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../src/swagger/swagger.json";
import useragent from 'express-useragent';
import requestIp from 'request-ip';

/**
 * Class representing the server setup with middleware configuration.
 */
export default class Server {
  /**
   * Initializes server with middlewares and routes.
   * @param {Application} app - The Express application instance.
   */
  constructor(app: Application) {
    this.middlewares(app);
    new routes(app);
  }

  /**
   * Configures middlewares for the application.
   * @param {Application} app - The Express application instance.
   */
  private middlewares(app: Application) {
    // Create a write stream (in append mode) for logging access requests
    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, "access.log"),
      { flags: "a" }
    );

    /**
     * App Configuration
     */

    // Security headers
    app.use(helmet());

    // CORS configuration allowing all origins
    app.use(cors({
      origin: '*'
    }));

    // HTTP request logging, excluding responses with status codes above 400
    app.use(
      morgan("combined", {
        stream: accessLogStream,
        skip: (req, res) => res.statusCode > 400,
      })
    );

    // Parses URL-encoded bodies and JSON bodies
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(express.urlencoded({ extended: true }));

    // Middleware to parse user agent information
    app.use(useragent.express());

    // Middleware to capture IP address of the requester
    app.use(requestIp.mw());

    // Swagger API documentation configuration
    const options: object = {
      customCss: ".swagger-ui .topbar { display: none }",
    };

    // Route for Swagger UI documentation
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, options)
    );
  }
}
