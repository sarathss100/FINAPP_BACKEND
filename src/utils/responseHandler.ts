import { SuccessResponse } from 'types/IResponseTypes';
import { Response } from 'express';

/**
 * Sends a standardized success response
 * @param {Response} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Success message.
 * @param {T | null} data - optional data to include in the response.
 */
export const sendSuccessResponse = <T extends Record<string, unknown>>(
    res: Response,
    statusCode: number,
    message: string,
    data: T | null = null
): Response => {
    const response: SuccessResponse<T> = {
        success: true,
        message,
        data
    }
    return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Error message.
 * @param {Array<string> | string | null} details - Optional error details
 */
export const sendErrorResponse = (
    res: Response,
    statusCode: number,
    message: string,
    details: Array<string> | string | null = null
): Response => {
    return res.status(statusCode).json({
        success: false,
        message,
        details
    });
};
