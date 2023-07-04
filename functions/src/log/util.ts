import {getAuditLogMiddleware as auditLog, getLogger, ILoggerConfig} from "@akrdevtech/lib-audit-logger";
import {ConfigManager} from "../config";

/**
 * The logger configuration.
 * @typedef {ILoggerConfig} ILoggerConfig
 */

const loggerConfig: ILoggerConfig = ConfigManager.getLoggerConfig();

/**
 * The logger instance.
 * @type {any} - The logger instance.
 */
const logger = getLogger(loggerConfig);

/**
 * Retrieves the audit log middleware.
 * @return {any} - The audit log middleware.
 */
export const getAuditLogMiddleware = () => auditLog(loggerConfig);

/**
 * Logs an informational message.
 * @param {string} message - The log message.
 * @param {...Record<string, unknown>} meta - Additional metadata to log.
 * @return {void}
 */
export function logInfo(message: string, ...meta: Record<string, unknown>[]): void {
  logger.info(message, meta);
}

/**
 * Logs an error message.
 * @param {string} message - The log message.
 * @param {...Record<string, unknown>} err - Additional error objects to log.
 * @return {void}
 */
export function logError(message: string, ...err: Record<string, unknown>[]): void {
  logger.error(message, err);
}

/**
 * Logs a warning message.
 * @param {string} message - The log message.
 * @return {void}
 */
export function logWarn(message: string): void {
  logger.warn(message);
}

/**
 * Logs a debug message.
 * @param {string} message - The log message.
 * @return {void}
 */
export function logDebug(message: string): void {
  logger.debug(message);
}

/**
 * The log types.
 * @enum {string}
 */
export enum ELogTypes {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
}

/**
 * Logs a message based on the log type.
 * @param {ELogTypes} type - The log type.
 * @param {string} moduleName - The module name.
 * @param {string} message - The log message.
 * @param {...Record<string, unknown>} err - Additional error objects to log.
 * @return {void}
 */
export function logMessage(type: ELogTypes, moduleName: string, message: string, ...err: Record<string, unknown>[]) {
  const thisMessage = `[${moduleName}] : ${message}`;
  switch (type) {
  case ELogTypes.INFO:
    logInfo(thisMessage);
    break;
  case ELogTypes.WARN:
    logWarn(thisMessage);
    break;
  case ELogTypes.DEBUG:
    logDebug(thisMessage);
    break;
  case ELogTypes.ERROR:
    logError(thisMessage, ...err);
    break;
  default:
    logInfo(thisMessage);
    break;
  }
}

/**
 * The application logger.
 * @type {object}
 */
export const appLogger = {
  logInfo,
  logError,
  logWarn,
  logDebug,
  logMessage,
  ELogTypes,
};
