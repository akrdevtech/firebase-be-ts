import express from "express";
import cors from "cors";
import {logInfo} from "./log/util";
import {HttpStatusCode, errorHandler} from "@akrdevtech/lib-error-handler-middleware";
import {expressRequestId} from "@akrdevtech/lib-express-request-id";
import {IAppConfig, IEnvConfig, IMongoConfig} from "./config";
import {BaseController} from "./controllers/BaseController";

/**
 * Creates CORS options based on the allowed origins.
 * @param {string[]} corsAllowedOrigins - The allowed origins for CORS.
 * @return {object} - The CORS options object.
 */
const getCorsOptions = (corsAllowedOrigins: string[]) => ({
  origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean | string) => void) => {
    if (corsAllowedOrigins.indexOf("*") !== -1 || corsAllowedOrigins.indexOf(origin||"") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

/**
 * The main application class.
 */
export class App {
  /**
   * The Express application instance.
   * @type {express.Application}
   */
  public app: express.Application;
  /**
   * The port number on which the application runs.
   * @type {string}
   */
  public port: string;
  /**
   * The environment configuration.
   * @type {IEnvConfig}
   */
  public envConfig: IEnvConfig;
  /**
   * The MongoDB configuration.
   * @type {IMongoConfig}
   */
  private mongoConfig: IMongoConfig;

  /**
   * Constructs an instance of the App class.
   * @param {Array<BaseController>} controllers - The array of controllers.
   * @param {string} port - The port number on which the application runs.
   * @param {IAppConfig} appConfig - The application configuration.
   */
  constructor(controllers: Array<BaseController>, port: string, appConfig: IAppConfig) {
    logInfo("Initializing express application");
    this.app = express();
    this.port = port;
    this.envConfig = appConfig.envConfig;
    this.mongoConfig = appConfig.mongoConfig;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  /**
   * Initializes the middlewares.
   * @private
   * @return {void}
   */
  private initializeMiddlewares() {
    this.app.options("*", cors());
    this.app.use(cors(getCorsOptions(this.envConfig.accessAllowedFrom)));

    this.app.use(expressRequestId());

    this.app.use(
      express.json({
        limit: "5MB",
        type: "application/json",
      }),
    );

    this.app.use(
      express.urlencoded({
        extended: true,
        parameterLimit: 5,
        limit: "5MB",
      }),
    );
  }

  /**
   * Initializes the controllers.
   * @private
   * @param {Array<BaseController>} controllers - The array of controllers.
   * @return {void}
   */
  private initializeControllers(controllers: Array<BaseController>) {
    controllers.forEach((controller) => {
      logInfo(`Initializing '${controller.constructor.name}' controller at path '${controller.getBasePath()}'`);
      this.app.use("/", controller.router);
    });
    // error middleware
    this.app.use(errorHandler);
    logInfo("All middlewares added successfully to the express application");
  }

  /**
   * Initializes the application and returns the Express application instance.
   * @return {Promise<express.Application>} - The Express application instance.
   */
  public initializeApp(): Promise<express.Application> {
    this.app.get("/", (req, res) => res.status(HttpStatusCode.OK).send("Akr Notification Service"));
    return Promise.resolve(this.app);
  }
}
