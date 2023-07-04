import {
  AccessDeniedError,
  BaseError,
  ConfigurationError,
  DatabaseError,
  InternalError,
  InvalidArgumentError,
  NotFoundError,
  RequestValidationMiddlewareError,
  ValidationError,
} from "@akrdevtech/lib-error-handler-middleware";

/**
   * Define error types for the app.
   * @class
   */
class AppErrors {
  /**
     * The Access Denied Error class.
     * @type {typeof AccessDeniedError}
     */
  public AccessDeniedError: typeof AccessDeniedError;

  /**
     * The Base Error class.
     * @type {typeof BaseError}
     */
  public BaseError: typeof BaseError;

  /**
     * The Configuration Error class.
     * @type {typeof ConfigurationError}
     */
  public ConfigurationError: typeof ConfigurationError;

  /**
     * The Database Error class.
     * @type {typeof DatabaseError}
     */
  public DatabaseError: typeof DatabaseError;

  /**
     * The Internal Error class.
     * @type {typeof InternalError}
     */
  public InternalError: typeof InternalError;

  /**
     * The Invalid Argument Error class.
     * @type {typeof InvalidArgumentError}
     */
  public InvalidArgumentError: typeof InvalidArgumentError;

  /**
     * The Not Found Error class.
     * @type {typeof NotFoundError}
     */
  public NotFoundError: typeof NotFoundError;

  /**
     * The Request Validation Middleware Error class.
     * @type {typeof RequestValidationMiddlewareError}
     */
  public RequestValidationMiddlewareError: typeof RequestValidationMiddlewareError;

  /**
     * The Validation Error class.
     * @type {typeof ValidationError}
     */
  public ValidationError: typeof ValidationError;

  /**
     * Creates an instance of the AppErrors class.
     * @constructor
     */
  constructor() {
    this.AccessDeniedError = AccessDeniedError;
    this.BaseError = BaseError;
    this.ConfigurationError = ConfigurationError;
    this.DatabaseError = DatabaseError;
    this.InternalError = InternalError;
    this.InvalidArgumentError = InvalidArgumentError;
    this.NotFoundError = NotFoundError;
    this.RequestValidationMiddlewareError = RequestValidationMiddlewareError;
    this.ValidationError = ValidationError;
  }
}

export default new AppErrors();

