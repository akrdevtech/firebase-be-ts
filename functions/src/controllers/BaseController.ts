/* eslint-disable new-cap */
import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {IAppFeatures} from "../interfaces/AppFeatures";
import {IAppConfig} from "../config";
import {logInfo} from "../log/util";
import {RequestValidator} from "@akrdevtech/lib-express-joi-validation-middleware";
import {ITransactionLogger, TransactionLogger} from "../middlewares/tracing/transaction_middleware";

/**
 * Represents options for a controller.
 */
export interface IControllerOptions {
  basePath: string;
  moduleName: string;
}

export interface IPagination { page: number; limit: number }

/**
 * Represents a base controller.
 */
export abstract class BaseController {
  protected API_BASE_URL: string;
  public appFeatures: IAppFeatures;
  public router: express.Router;
  protected appLogger: IAppFeatures["AppLoger"];
  public basePath: string;
  protected appConfig: IAppConfig;
  protected transactionLogger: ITransactionLogger;
  protected validator: RequestValidator;
  protected validateAll: unknown;
  protected validateBody: unknown;
  protected validateCookies: unknown;
  protected validateHeaders: unknown;
  protected validateQuery: unknown;
  protected validateParams: unknown;

  /**
   * Creates an instance of BaseController.
   * @param {IAppConfig} appConfig - The application configuration.
   * @param {IControllerOptions} options - The controller options.
   * @param {IAppFeatures} [appFeatures] - The application features.
   */
  constructor(appConfig: IAppConfig, options: IControllerOptions, appFeatures: IAppFeatures) {
    this.appConfig = appConfig;
    this.API_BASE_URL = appConfig.envConfig.apiBaseUrl;
    this.appFeatures = appFeatures;
    this.appLogger = this.appFeatures.AppLoger;
    this.basePath = `${this.API_BASE_URL}${options.basePath}`;
    this.transactionLogger = new TransactionLogger(options.moduleName);
    this.validator = new RequestValidator({abortEarly: false});
    this.validateAll = this.validator.validateAll;
    this.validateBody = this.validator.validateBody;
    this.validateCookies = this.validator.validateCookies;
    this.validateHeaders = this.validator.validateHeaders;
    this.validateQuery = this.validator.validateQuery;
    this.validateParams = this.validator.validateParams;
    this.router = express.Router();
  }

  /**
   * Handles async request handlers.
   * @param {RequestHandler} fn - The request handler function.
   * @return {RequestHandler} The async request handler.
   */
  protected asyncHandler = (fn: RequestHandler): RequestHandler => {
    /**
     * Async request handler.
     * @param {Request} req - The express request object.
     * @param {Response} res - The express response object.
     * @param {NextFunction} next - The next function.
     * @return {Promise<any>} A promise that resolves to the response.
     */
    return (req: Request, res: Response, next: NextFunction): Promise<any> => {
      logInfo(`[transactionId] ${req.txId}`);
      return Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  /**
   * Gets the base path of the controller.
   * @returns {string} The base path.
   */
  public abstract getBasePath(): string;

  /**
   * Sends a response with the specified status and data.
   * @param {Response} response - The express response object.
   * @param {number} status - The HTTP status code.
   * @param {T} data - The response data to be returned.
   */
  protected sendResponse<T>(response: Response, status: number, data: T): void {
    if (status >= 400) response.status(status).send(data);
    else response.status(status).send(data);
  }

  /**
   * Gets pagination parameters.
   * @param {number} [page] - The page number.
   * @param {number} [limit] - The number of items per page.
   * @return {IPagination} The pagination parameters.
   */
  protected getPagination(page?: number, limit?: number): IPagination {
    return {page: page || 1, limit: limit || 10};
  }
}
