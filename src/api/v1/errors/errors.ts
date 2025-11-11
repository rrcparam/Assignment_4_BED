import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Base application error class.
 * Provides a consistent structure for all custom errors in the API.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, HTTP_STATUS.BAD_REQUEST, "VALIDATION_ERROR");
  }
}

/**
 * Authentication Error (401)
 */
export class AuthenticationError extends AppError {
  constructor(
    message = "Authentication failed",
    code = "AUTHENTICATION_ERROR"
  ) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

/**
 * Authorization Error (403)
 */
export class AuthorizationError extends AppError {
  constructor(
    message = "Forbidden access",
    code = "AUTHORIZATION_ERROR"
  ) {
    super(message, HTTP_STATUS.FORBIDDEN, code);
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
  }
}
