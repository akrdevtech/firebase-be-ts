/* eslint-disable new-cap */
import express from "express";
import {IAppFeatures} from "../../interfaces/AppFeatures";
import {IAppConfig} from "../../config";
import {BaseController} from "../BaseController";
import {HttpStatusCode} from "@akrdevtech/lib-error-handler-middleware";
/**
 * Represents a Health Check Controller.
 * @extends BaseController
 */
export class HealthCheckController extends BaseController {
  /**
   * Creates an instance of HealthCheckController.
   * @param {IAppConfig} appConfig - The application configuration.
   * @param {IAppFeatures} [appFeatures] - The application features.
   */
  constructor(appConfig: IAppConfig, appFeatures: IAppFeatures) {
    super(appConfig, {basePath: "/healthcheck", moduleName: "Health Controller"}, appFeatures);
    this.router = express.Router();
    this.intializeRoutes();
  }

  /**
   * Gets the base path of the controller.
   * @return {string} The base path.
   */
  public getBasePath(): string {
    return this.basePath;
  }

  /**
   * Initializes the routes for the controller.
   */
  public intializeRoutes(): void {
    this.router.get(this.basePath, [
      this.transactionLogger.logTransaction("Get App Health"),
      this.getHealth,
    ]);
  }

  /**
   * Handles the GET request for app health.
   * @param {express.Request} request - The express request object.
   * @param {express.Response} response - The express response object.
   */
  private getHealth = (request: express.Request, response: express.Response) => {
    response.status(HttpStatusCode.OK).send({status: "ok", txId: request.txId, appConfig: this.appConfig});
  };
}
