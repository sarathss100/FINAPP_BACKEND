// Base error class
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        console.log(`${statusCode} and ${message}`);

        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// ValidationError for invalid input
export class ValidationError extends AppError {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

// AuthenticationError for token-related issues
export class AuthenticationError extends AppError {
    constructor(message: string, statusCode: number = 401) {
        super(message, statusCode);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

// AuthorizatonError for permission-related issues
export class AuthorizatonError extends AppError {
    constructor(message: string, statusCode: number = 403) {
        super(message, statusCode);
        Object.setPrototypeOf(this, AuthorizatonError.prototype);
    }
}

// ServerError for unexpected server-side issues
export class ServerError extends AppError {
    constructor(message: string = `An unexpected server error occurred`, statusCode: number = 500) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

// Not found Error 
export class NotFoundError extends AppError {
    constructor(message: string = 'The requested resource was not found.', statusCode: number = 404) {
        super(message, statusCode);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

// Conflict Error
export class ConflictError extends AppError {
    constructor(message: string = 'A conflict occurred with the current state of the resource.', statusCode: number = 409) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

// Forbidden Error
export class ForbiddenError extends AppError {
    constructor(message: string = 'You do not have sufficient permissions to perform this action.', statusCode: number = 403) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

// Service Unavailable Error
export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'The service is currently unavailable. Please try again later.', statusCode: number = 503) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}
