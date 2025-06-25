import { Response, NextFunction } from 'express';
import { UserRole } from 'types/auth/roles';
import { sendErrorResponse } from 'utils/responseHandler';
import { StatusCodes } from 'constants/statusCodes';
import { generateAccessToken, verifyAccessToken } from 'utils/auth/tokenUtils';
import IAuthenticationRequest from './interfaces/IAuthenticationRequest';
import { ErrorMessages } from 'constants/errorMessages';
import RedisService from 'services/redis/RedisService';
import ITokenPayload from 'types/auth/ITokenPayload';

// Middleware to verify JWT and check roles
export const authorizeRoles = function (...allowedRoles: UserRole[]) {
    return async (request: IAuthenticationRequest, response: Response, next: NextFunction) => {
        try {
            // Extract the token from the Authorization header
            const authHeader = request.cookies;
            if (!authHeader) {
                sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.ACCESS_TOKEN_NOT_FOUND);
                return;
            }

            // Retrieve accessToken from headers
            let accessToken = authHeader.accessToken;

            // Verify access token
            let decoded = verifyAccessToken(accessToken);

            if (!decoded) {
                sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.TOKEN_VERIFICATION_FAILED);
                return;
            } 

            const currentTime = Math.floor(Date.now() / 1000);

            // If token is expired, try refreshing it 
            if (decoded.exp && decoded.exp < currentTime) {
                const userId = decoded.userId;

                // Try to retrieve refresh token from Redis 
                const refreshTokenFromRedis = await RedisService.getRefreshToken(userId);

                if (!refreshTokenFromRedis) {
                    // No refresh token foud, force logout,
                    sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.REFRESH_TOKEN_FAILED);
                    response.clearCookie('accessToken', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'? true : false,
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    });

                    response.clearCookie('userMetaData', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'? true : false,
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    });
                    return;
                }

                // Generate a new access token
                const newAccessToken = generateAccessToken({ 
                    userId: decoded.userId, 
                    role: decoded.role, 
                    phoneNumber: decoded.phoneNumber, 
                    status: decoded.status, 
                    is2FA: false 
                });

                // Set the new access toke in cookies or headers
                response.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });

                // Update decoded with new access token 
                decoded = verifyAccessToken(newAccessToken) as ITokenPayload;
                accessToken = newAccessToken;
            }

            // Final check: ensure decoded is valid
            if (!decoded) {
                sendErrorResponse(response, StatusCodes.UNAUTHORIZED, ErrorMessages.TOKEN_VERIFICATION_FAILED);
                return;
            }

            // Role-based authorization
            if (!allowedRoles.includes(decoded.role as UserRole)) {
                sendErrorResponse(response, StatusCodes.FORBIDDEN, ErrorMessages.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
                return;
            }

            // Attach the user's ID and role to the request object for downstream use
            request.user = { userId: decoded.userId, role: decoded.role };
        
            // Continue with the new token
            next();
        } catch (error) {
            console.error(`Error in authorizeRoles middleware:`, error);
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            return; // Terminate the middleware
        }
    }
}
