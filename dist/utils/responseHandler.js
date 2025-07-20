"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
/**
 * Sends a standardized success response
 * @param {Response} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Success message.
 * @param {T | null} data - optional data to include in the response.
 */
const sendSuccessResponse = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message,
        data
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccessResponse = sendSuccessResponse;
/**
 * Sends a standardized error response.
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Error message.
 * @param {Array<string> | string | null} details - Optional error details
 */
const sendErrorResponse = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        details
    });
};
exports.sendErrorResponse = sendErrorResponse;
