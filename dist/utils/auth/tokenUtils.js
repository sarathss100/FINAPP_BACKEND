"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAndValidateToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const AppError_1 = require("error/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Token secret keys 
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFERSH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET || !REFERSH_TOKEN_SECRET) {
    throw new Error(`Missing required environment variables: ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET`);
}
/**
 * Generates an access token for a user.
 * @param user The user object for whom the token is generated.
 * @returns A signed JWT access token.
 */
const generateAccessToken = function (user) {
    return jsonwebtoken_1.default.sign({ userId: user.userId, phoneNumber: user.phoneNumber, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generates a refresh token for a user.
 * @param user The user object for whom the token is generated.
 * @returns A signed JWT refresh token.
 */
const generateRefreshToken = function (user) {
    return jsonwebtoken_1.default.sign({ userId: user.userId, phoneNumber: user.phoneNumber, role: user.role }, REFERSH_TOKEN_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verifies an access token and returns its payload
 * @param token The access token to verify
 * @returns The decoded payload of the token
 * @throws Error if the token is invalid or expired.
 */
const verifyAccessToken = function (token) {
    try {
        // Verify and decode the token 
        const res = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        return res;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error(`Access token has expired`);
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error(`Invalid access token`);
        }
        else {
            throw new Error(`An unexpected error occured while verifying the access token`);
        }
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verifies a refresh token and returns its payload.
 * @param token The refresh token to verify.
 * @returns The decoded payload of the token.
 * @throws Error if the token is invalid or expired.
 */
const verifyRefreshToken = function (token) {
    try {
        // Verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, REFERSH_TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error(`Access token has expired`);
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error(`Invalid access token`);
        }
        else {
            throw new Error(`An unexpected error occured while verifying the access token`);
        }
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Decodes and validates an access token, ensuring it contains a valid user ID.
 * @param accessToken The access token to decode and validate.
 * @returns The user ID extracted from the token payload.
 * @throws AuthenticationError if the token verification fails.
 * @throws ServerError if the token is valid but does not contain a user ID.
 */
const decodeAndValidateToken = function (accessToken) {
    // Verify the access token
    const decodedData = (0, exports.verifyAccessToken)(accessToken);
    if (!decodedData)
        throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.TOKEN_VERIFICATION_FAILED, statusCodes_1.StatusCodes.UNAUTHORIZED);
    // Extract the user ID from the decoded token payload
    const { userId } = decodedData;
    if (!userId)
        throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
    // Return the user ID for further use
    return userId;
};
exports.decodeAndValidateToken = decodeAndValidateToken;
