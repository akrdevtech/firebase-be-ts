/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {NextFunction, Request, Response} from "express";

const generatePropertyKeyIfArray = () => {
  return (key:unknown) => {
    return `${key}_${Math.random() * 100000}`;
  };
};

const flattern = (data: unknown) => {
  return Object.assign(
    {},
    ...((function _flatten(o) {
      return [].concat(
        ...Object.keys(o).map((k) => {
          return o[k] && typeof o[k] === "object" ?
            _flatten(o[k]) :
            {[generatePropertyKeyIfArray()(k)]: o[k] ? o[k] : ""};
        })
      );
    })(data) || {})
  );
};


const havingBadData = (data: unknown) => {
  const flatData = flattern(data);
  const keys = Object.keys(flatData);
  const errors:unknown[] = [];
  keys.forEach((key) => {
    if (typeof flatData[key] === "string" && flatData[key].match(/\[[^\]]+\]|\{[^}]+\}|<[^>]+>/)) {
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

export const requestValidationMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  const {hasError, errors} = havingBadData(Object.assign({}, req.body || {}, req.params || {}, req.query || {}));
  if (hasError) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
      source: "Internal",
      transactionId: req.txId,
    });
  }
  next();
};
