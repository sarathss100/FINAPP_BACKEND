"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.ForbiddenError = exports.ConflictError = exports.NotFoundError = exports.ServerError = exports.AuthorizatonError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
// Base error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        console.log(`${statusCode} and ${message}`);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
// ValidationError for invalid input
class ValidationError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
// AuthenticationError for token-related issues
class AuthenticationError extends AppError {
    constructor(message, statusCode = 401) {
        super(message, statusCode);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
exports.AuthenticationError = AuthenticationError;
// AuthorizatonError for permission-related issues
class AuthorizatonError extends AppError {
    constructor(message, statusCode = 403) {
        super(message, statusCode);
        Object.setPrototypeOf(this, AuthorizatonError.prototype);
    }
}
exports.AuthorizatonError = AuthorizatonError;
// ServerError for unexpected server-side issues
class ServerError extends AppError {
    constructor(message = `An unexpected server error occurred`, statusCode = 500) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
exports.ServerError = ServerError;
// Not found Error 
class NotFoundError extends AppError {
    constructor(message = 'The requested resource was not found.', statusCode = 404) {
        super(message, statusCode);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
// Conflict Error
class ConflictError extends AppError {
    constructor(message = 'A conflict occurred with the current state of the resource.', statusCode = 409) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
exports.ConflictError = ConflictError;
// Forbidden Error
class ForbiddenError extends AppError {
    constructor(message = 'You do not have sufficient permissions to perform this action.', statusCode = 403) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
exports.ForbiddenError = ForbiddenError;
// Service Unavailable Error
class ServiceUnavailableError extends AppError {
    constructor(message = 'The service is currently unavailable. Please try again later.', statusCode = 503) {
        super(message, statusCode);
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
