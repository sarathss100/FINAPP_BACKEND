// Base error class
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

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
