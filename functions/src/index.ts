/**
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import {ConfigManager} from "./config";
import {App} from "./app";
import {HealthCheckController} from "./controllers/common/HealthCheckController";
import {appLogger} from "./log/util";
import {IAppFeatures} from "./interfaces/AppFeatures";

const appConfig = ConfigManager.getAppConfig();

const port = process.env.SERVER_PORT || appConfig.envConfig.port || "8081";

const controllers = [
  HealthCheckController,
];

const appFeatures: IAppFeatures = {
  AppLoger: appLogger,
};
const expressApp = new App(
  controllers.map((Controller) => new Controller(appConfig, appFeatures)),
  port,
  appConfig,
);
expressApp.initializeApp();
// Export the Express app as a Firebase Cloud Function
exports.app = onRequest(expressApp.app);
