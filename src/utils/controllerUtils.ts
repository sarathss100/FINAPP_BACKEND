import { Request, Response } from 'express';
import { StatusCodes } from '../constants/statusCodes';
import { ErrorMessages } from '../constants/errorMessages';
import { AppError, AuthenticationError } from '../error/AppError';
import { sendErrorResponse } from './responseHandler';

export function getAccessTokenOrThrow(request: Request): string {
    const token = request.cookies?.accessToken;
    if (!token) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
    }
    return token;
}

export function handleControllerError(response: Response, error: unknown): void {
    if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
    } else {
        console.error('Unhandled controller error:', error);
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
    }
}
