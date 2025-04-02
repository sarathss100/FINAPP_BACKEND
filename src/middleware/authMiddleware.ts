import { Request, Response, NextFunction } from 'express';
import { UserRole } from 'types/roles';
import { sendErrorResponse } from 'utils/responseHandler';
import { StatusCodes } from 'utils/statusCodes';
import { verifyAccessToken } from 'utils/tokenUtils';
import IAuthenticationRequest from './interfaces/IAuthenticationRequest';

// Middleware to verify JWT and check roles
export const authorizeRoles = function (...allowedRoles: UserRole[]) {
    return async (request: IAuthenticationRequest, response: Response, next: NextFunction) => {
        try {
            // Extract the token from the Authorization header
            const authHeader = request?.cookies;
            if (!authHeader) {
                sendErrorResponse(response, StatusCodes.UNAUTHORIZED, `Unauthorized: Missing token in cookies`);
                return; // Terminate the middleware due missing token
            }

            const { accessToken } = authHeader;
            if (!accessToken) throw new Error(`Missing access token in authHeader. Authorization aborted.`);

            const decoded = verifyAccessToken(accessToken);
            
            if (!decoded) throw new Error(`Authentication failed. Your session may have expired. Please log in again and try again.`);

            if (!allowedRoles.includes(decoded.role as UserRole)) {
                sendErrorResponse(response, StatusCodes.FORBIDDEN, `Forbidden: Insufficient permissions`);
                return; // Terminate the middleware due to insufficient perimissions 
            }

            // Attach the user's ID and role to the request object for downstream use
            request.user = { userId: decoded.userId, role: decoded.role };
            next();
        } catch (error) {
            console.error(`Error in authorizeRoles middleware:`, error);
            sendErrorResponse(response, StatusCodes.NOT_FOUND, `Unauthorized: Invalid Token`);
            return; // Terminate the middleware
        }
    }
}
