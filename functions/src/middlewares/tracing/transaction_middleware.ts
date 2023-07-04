import express, {NextFunction, Request, Response} from "express";
import {HttpHeader} from "../../enums/httpHeader";
import {logInfo} from "../../log/util";
import {randomUUID} from "crypto";

/**
 * Middleware function to add a transaction ID to the request.
 * @param {express.Request} req - The Express Request object.
 * @param {express.Response} _res The Express Response object.
 * @param {express.NextFunction} next - The NextFunction to pass control to the next middleware.
 */
export const addTransactionId = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
): void => {
  const uuid = randomUUID();
  (req.headers as { [key: string]: unknown })[HttpHeader.TX_ID] = uuid;
  req.txId = uuid;
  next();
};

/**
 * Checks if an object is empty.
 * @param {unknown} obj - The object to check.
 * @return {unknown} True if the object is empty, false otherwise.
 */
function isEmpty(obj: unknown) {
  for (const prop in obj as any) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

/**
 * Interface for the TransactionLogger class.
 * @interface
 */
export interface ITransactionLogger {
  logTransaction: (message?: string) => (request: Request, _response: Response, next: NextFunction) => void;
}

/**
 * Class for logging transactions.
 */
export class TransactionLogger implements ITransactionLogger {
  private moduleName: string;

  /**
   * Constructs a new TransactionLogger instance.
   * @param {string} moduleName - The name of the module.
   */
  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  /**
   * Middleware function to log a transaction.
   * @param {string} [message] - Optional message to include in the log.
   * @return {Function} The middleware function.
   */
  public logTransaction(message?: string) {
    return (request: Request, _response: Response, next: NextFunction) => {
      let logMessage = `[${this.moduleName.toUpperCase()}] TxId ${request.txId} - ${message ? message : ""
      } `;
      const {body, params, query} = request;
      if (!isEmpty(body) || !isEmpty(params) || !isEmpty(query)) {
        const data = Object.assign({body, params, query});
        logMessage += ` - Request ${JSON.stringify(data)}`;
      }
      logInfo(logMessage);
      next();
    };
  }
}
