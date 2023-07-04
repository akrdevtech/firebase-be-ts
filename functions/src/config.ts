import config from "config";
import {VENDOR} from "./enums/vendor";
import AppErrors from "./errors";
const {ConfigurationError} = AppErrors;

/**
 * The configuration for MongoDB.
 * @interface
 */
export interface IMongoConfig {
  uri: string;
  dbName: string;
  ssl: boolean;
  logLevel: string;
}

/**
 * The environment configuration.
 * @interface
 */
export interface IEnvConfig {
  name: string;
  port: string;
  apiBaseUrl: string;
  serviceName: string;
  accessAllowedFrom: string[];
  openEndpoints: string[];
  lockedEndpoints: string[];
  internalApiKey: string;
  auditLogExcludedPaths: string[];
}

/**
 * The logger configuration.
 * @interface
 */
export interface ILoggerConfig {
  name: string;
  serviceName: string;
  auditLogExcludedPaths: string[];
}

/**
 * The application configuration.
 * @interface
 */
export interface IAppConfig {
  envConfig: IEnvConfig;
  mongoConfig: IMongoConfig;
}

/**
 * The configuration properties.
 * @interface
 */
interface IConfigProperties {
  [key: string]: string;
}

/**
 * The vendor-specific configuration.
 * @typedef {IMongoConfig} TVendorConfig
 */
type TVendorConfig = IMongoConfig;

/**
 * Manages the configuration for the application.
 * @class
 */
export class ConfigManager {
  /**
   * Checks if an array contains only strings.
   * @param {Array<string>} array - The array to check.
   * @return {boolean} - True if the array contains only strings, false otherwise.
   */
  private static isStringArray(array: Array<string>): boolean {
    return Array.isArray(array) && array.filter((item) => typeof item !== "string").length === 0;
  }

  /**
   * Retrieves the logger configuration.
   * @return {ILoggerConfig} - The logger configuration.
   * @throws {ConfigurationError} - If any required configuration is missing.
   */
  public static getLoggerConfig(): ILoggerConfig {
    const auditLogExcludedPaths = config.get("Environment.auditLogExcludedPaths") as string[];
    const {name, serviceName} = config.get("Environment") as IConfigProperties;

    if (!name || !serviceName) {
      throw new ConfigurationError("Please add all required configuration for the environment");
    }

    const loggerConfig: ILoggerConfig = {
      name,
      serviceName,
      auditLogExcludedPaths,
    };

    return loggerConfig;
  }

  /**
   * Retrieves the environment configuration.
   * @return {IEnvConfig} - The environment configuration.
   * @throws {ConfigurationError} - If any required configuration is missing or invalid.
   */
  public static getEnvConfig(): IEnvConfig {
    const accessAllowedFrom = config.get("Environment.accessAllowedFrom") as string[];
    const openEndpoints = config.get("Environment.openEndpoints") as string[];
    const lockedEndpoints = config.get("Environment.lockedEndpoints") as string[];
    const auditLogExcludedPaths = config.get("Environment.auditLogExcludedPaths") as string[];
    const port = config.get("Environment.port") as number;

    if (!this.isStringArray(accessAllowedFrom)) {
      throw new ConfigurationError("Environment -> accessAllowedFrom should be string array");
    }

    const {name, apiBaseUrl, serviceName, internalApiKey} = config.get("Environment") as IConfigProperties;

    if (!name || !apiBaseUrl || !serviceName) {
      throw new ConfigurationError("Please add all required configuration for the environment");
    }

    const envConfig: IEnvConfig = {
      name,
      port: port.toString(),
      accessAllowedFrom,
      apiBaseUrl,
      serviceName,
      internalApiKey,
      openEndpoints,
      lockedEndpoints,
      auditLogExcludedPaths,
    };

    return envConfig;
  }

  /**
   * Retrieves the vendor-specific configuration.
   * @param {VENDOR} vendor - The vendor.
   * @return {TVendorConfig} - The vendor-specific configuration.
   * @throws {ConfigurationError} - If any required configuration is missing or invalid.
   */
  private static getVendorConfig(vendor: VENDOR): TVendorConfig {
    switch (vendor) {
    case VENDOR.MONGO: {
      const {uri, dbName, ssl = false, logLevel = "info"} = config.get("Services.mongo") as IConfigProperties;
      if (!uri || !dbName || !logLevel) {
        throw new ConfigurationError(`Please add all required configuration for vendor: ${vendor}`);
      }

      const mongoConfig: IMongoConfig = {
        uri,
        dbName,
        ssl: Boolean(ssl),
        logLevel,
      };

      return mongoConfig;
    }
    }
  }

  /**
   * Retrieves the application configuration.
   * @return {IAppConfig} - The application configuration.
   */
  public static getAppConfig(): IAppConfig {
    // All application configurations should go here
    return {
      envConfig: this.getEnvConfig(),
      mongoConfig: this.getVendorConfig(VENDOR.MONGO),
    };
  }
}
