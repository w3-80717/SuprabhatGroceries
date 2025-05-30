// Custom Error Classes

export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean; // To distinguish between operational and programmer errors

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends ApiError {
  public details?: any[];
  constructor(message = 'Bad Request', details?: any[]) { // Accept details
    super(400, message);
    if (details) this.details = details;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

// You can add more specific error classes as needed (e.g., ValidationError)