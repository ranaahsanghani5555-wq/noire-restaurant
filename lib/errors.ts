/**
 * Typed application errors.
 * Route handlers translate these into clean REST responses. Never expose raw
 * Prisma/database errors or stack traces to customers.
 */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "UNAVAILABLE"
  | "INTERNAL";

interface ErrorOptions {
  status: number;
  code: ApiErrorCode;
  fieldErrors?: Record<string, string>;
}

export class AppError extends Error {
  status: number;
  code: ApiErrorCode;
  fieldErrors?: Record<string, string>;

  constructor(message: string, { status, code, fieldErrors }: ErrorOptions) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message, { status: 422, code: "VALIDATION_ERROR", fieldErrors });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, { status: 401, code: "UNAUTHORIZED" });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do this") {
    super(message, { status: 403, code: "FORBIDDEN" });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, { status: 404, code: "NOT_FOUND" });
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, { status: 409, code: "CONFLICT" });
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(message, { status: 429, code: "RATE_LIMITED" });
  }
}

export class UnavailableError extends AppError {
  constructor(message = "This is currently unavailable") {
    super(message, { status: 400, code: "UNAVAILABLE" });
  }
}