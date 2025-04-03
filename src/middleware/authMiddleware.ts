import { Response, NextFunction } from 'express';
import { UserRole } from 'types/auth/roles';
import { sendErrorResponse } from 'utils/responseHandler';
import { StatusCodes } from 'constants/statusCodes';
import { verifyAccessToken } from 'utils/auth/tokenUtils';
import IAuthenticationRequest from './interfaces/IAuthenticationRequest';
import { ErrorMessages } from 'constants/errorMessages';

// Middleware to verify JWT and check roles
export const authorizeRoles = function (...allowedRoles: UserRole[]) {
    return async (request: IAuthenticationRequest, response: Response, next: NextFunction) => {
        try {
            // Extract the token from the Authorization header
            const authHeader = request.cookies;
            if (!authHeader) {
                sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.ACCESS_TOKEN_NOT_FOUND);
                return; // Terminate the middleware due missing token
            }

            const { accessToken } = authHeader;

            const decoded = verifyAccessToken(accessToken);
            if (!decoded) {
                sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.TOKEN_VERIFICATION_FAILED);
                return;
            } 

            if (!allowedRoles.includes(decoded.role as UserRole)) {
                sendErrorResponse(response, StatusCodes.FORBIDDEN, ErrorMessages.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
                return; // Terminate the middleware due to insufficient perimissions 
            }

            // Attach the user's ID and role to the request object for downstream use
            request.user = { userId: decoded.userId, role: decoded.role };
            next();
        } catch (error) {
            console.error(`Error in authorizeRoles middleware:`, error);
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            return; // Terminate the middleware
        }
    }
}
