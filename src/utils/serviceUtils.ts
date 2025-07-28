import { ErrorMessages } from "../constants/errorMessages";
import { StatusCodes } from "../constants/statusCodes";
import { AuthenticationError } from "../error/AppError";
import { decodeAndValidateToken } from "./auth/tokenUtils";

export function extractUserIdFromToken(token: string): string {
    const userId = decodeAndValidateToken(token);
    if (!userId) {
        throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
    }
    return userId;
}

export function wrapServiceError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error((error as Error)?.message || 'Unknown service error');
}
