"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const responseHandler_1 = require("utils/responseHandler");
const statusCodes_1 = require("constants/statusCodes");
const tokenUtils_1 = require("utils/auth/tokenUtils");
const errorMessages_1 = require("constants/errorMessages");
const RedisService_1 = __importDefault(require("services/redis/RedisService"));
// Middleware to verify JWT and check roles
const authorizeRoles = function (...allowedRoles) {
    return (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract the token from the Authorization header
            const authHeader = request.cookies;
            if (!authHeader) {
                (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.UNAUTHORIZED, errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND);
                return;
            }
            // Retrieve accessToken from headers
            let accessToken = authHeader.accessToken;
            // Verify access token
            let decoded = (0, tokenUtils_1.verifyAccessToken)(accessToken);
            if (!decoded) {
                (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.UNAUTHORIZED, errorMessages_1.ErrorMessages.TOKEN_VERIFICATION_FAILED);
                return;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            // If token is expired, try refreshing it 
            if (decoded.exp && decoded.exp < currentTime) {
                const userId = decoded.userId;
                // Try to retrieve refresh token from Redis 
                const refreshTokenFromRedis = yield RedisService_1.default.getRefreshToken(userId);
                if (!refreshTokenFromRedis) {
                    // No refresh token foud, force logout,
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.UNAUTHORIZED, errorMessages_1.ErrorMessages.REFRESH_TOKEN_FAILED);
                    response.clearCookie('accessToken', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production' ? true : false,
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    });
                    response.clearCookie('userMetaData', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production' ? true : false,
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    });
                    return;
                }
                // Generate a new access token
                const newAccessToken = (0, tokenUtils_1.generateAccessToken)({
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
                decoded = (0, tokenUtils_1.verifyAccessToken)(newAccessToken);
                accessToken = newAccessToken;
            }
            // Final check: ensure decoded is valid
            if (!decoded) {
                (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.UNAUTHORIZED, errorMessages_1.ErrorMessages.TOKEN_VERIFICATION_FAILED);
                return;
            }
            // Role-based authorization
            if (!allowedRoles.includes(decoded.role)) {
                (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.FORBIDDEN, errorMessages_1.ErrorMessages.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
                return;
            }
            // Attach the user's ID and role to the request object for downstream use
            request.user = { userId: decoded.userId, role: decoded.role };
            // Continue with the new token
            next();
        }
        catch (error) {
            console.error(`Error in authorizeRoles middleware:`, error);
            (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
            return; // Terminate the middleware
        }
    });
};
exports.authorizeRoles = authorizeRoles;
