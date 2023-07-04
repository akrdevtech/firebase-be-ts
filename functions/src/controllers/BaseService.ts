import {IAppFeatures} from "../interfaces/AppFeatures";

/**
 * Options for the BaseService class.
 * @interface
 */
export interface IServicesOptions {
  moduleName: string;
}

/**
 * The base service class.
 * @abstract
 */
export abstract class BaseService {
  /**
   * The application features.
   * @type {IAppFeatures}
   */
  public appFeatures: IAppFeatures;
  /**
   * The application logger.
   * @type {IAppFeatures["AppLoger"]}
   */
  protected appLogger: IAppFeatures["AppLoger"];
  /**
   * The module name.
   * @type {string}
   */
  protected moduleName: string;

  /**
   * Constructs an instance of the BaseService class.
   * @constructor
   * @param {IAppFeatures} [appFeatures] - The application features.
   * @param {IServicesOptions} [options] - The options for the BaseService class.
   */
  constructor(appFeatures: IAppFeatures, options: IServicesOptions) {
    this.appFeatures = appFeatures;
    this.appLogger = this.appFeatures.AppLoger;
    this.moduleName = options.moduleName;
  }

  /**
   * Logs an info message.
   * @protected
   * @param {string} message - The info message to log.
   * @return {void}
   */
  protected logInfo(message: string) {
    this.appLogger.logMessage(this.appLogger.ELogTypes.INFO, this.moduleName, message);
  }

  /**
   * Logs a warning message.
   * @protected
   * @param {string} message - The warning message to log.
   * @return {void}
   */
  protected logWarn(message: string) {
    this.appLogger.logMessage(this.appLogger.ELogTypes.WARN, this.moduleName, message);
  }

  /**
   * Logs a debug message.
   * @protected
   * @param {string} message - The debug message to log.
   * @return {void}
   */
  protected logDebug(message: string) {
    this.appLogger.logMessage(this.appLogger.ELogTypes.DEBUG, this.moduleName, message);
  }

  /**
   * Logs an error message.
   * @protected
   * @param {string} message - The error message to log.
   * @param {...Record<string, unknown>} err - Additional error information.
   * @return {void}
   */
  protected logError(message: string, ...err: Record<string, unknown>[]) {
    this.appLogger.logMessage(this.appLogger.ELogTypes.ERROR, this.moduleName, message, ...err);
  }
}
