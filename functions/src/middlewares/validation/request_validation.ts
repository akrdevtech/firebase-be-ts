/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {NextFunction, Request, Response} from "express";


const generatePropertyKeyIfArray = (key: unknown) => `${key}_${Math.random() * 100000}`;

const flattenObject = (obj: Record<string, unknown>): Record<string, unknown>[] => {
  return Object.keys(obj).flatMap((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      return flattenObject(obj[key] as Record<string, unknown>);
    }
    return {[generatePropertyKeyIfArray(key)]: obj[key] || ""};
  }) as Record<string, unknown>[];
};

const flatten = (data: Record<string, unknown>): Record<string, unknown> => {
  const flattenedArray = flattenObject(data);
  return Object.assign({}, ...flattenedArray);
};


const havingBadData = (data: unknown) => {
  const flatData = flatten(data as Record<string, unknown>);
  const keys = Object.keys(flatData);
  const errors: unknown[] = [];
  keys.forEach((key) => {
    if (typeof flatData[key] === "string" && (flatData[key] as string).match(/\[[^\]]+\]|\{[^}]+\}|<[^>]+>/)) {
      errors.push({
        msg: `Invalid data ${flatData[key]}`,
        param: key.split("_")[0],
        location: "body",
      });
    }
  });
  return {
    hasError: errors.length > 0,
    errors,
  };
};

export const requestValidationMiddleware = () => (req: Request, res: Response, next: NextFunction): unknown => {
  const {hasError, errors} = havingBadData(Object.assign({}, req.body || {}, req.params || {}, req.query || {}));
  if (hasError) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
      source: "Internal",
      transactionId: req.txId,
    });
  }
  return next();
};
