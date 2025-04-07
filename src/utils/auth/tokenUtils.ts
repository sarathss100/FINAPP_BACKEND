import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { AuthenticationError, ServerError } from 'error/AppError';
import jwt from 'jsonwebtoken';
import IAuthUser from 'services/auth/interfaces/IAuthUser';
import ITokenPayload from 'types/auth/ITokenPayload';

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
export const generateAccessToken = function (user: IAuthUser): string {
    return jwt.sign(
        { userId: user.userId, phoneNumber: user.phoneNumber, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
};

/**
 * Generates a refresh token for a user.
 * @param user The user object for whom the token is generated.
 * @returns A signed JWT refresh token.
 */
export const generateRefreshToken = function (user: IAuthUser): string {
    return jwt.sign(
        { userId: user.userId, phoneNumber: user.phoneNumber, role: user.role },
        REFERSH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
};

/**
 * Verifies an access token and returns its payload
 * @param token The access token to verify
 * @returns The decoded payload of the token
 * @throws Error if the token is invalid or expired.
 */
export const verifyAccessToken = function (token: string): ITokenPayload {
    try {
        // Verify and decode the token 
        const res = jwt.verify(token, ACCESS_TOKEN_SECRET) as ITokenPayload;
        return res;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error(`Access token has expired`);
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error(`Invalid access token`);
        } else {
            throw new Error(`An unexpected error occured while verifying the access token`);
        }
    }
};

/**
 * Verifies a refresh token and returns its payload.
 * @param token The refresh token to verify.
 * @returns The decoded payload of the token.
 * @throws Error if the token is invalid or expired.
 */
export const verifyRefreshToken = function (token: string): ITokenPayload {
    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, REFERSH_TOKEN_SECRET);
     
        return decoded as ITokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error(`Access token has expired`);
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error(`Invalid access token`);
        } else {
            throw new Error(`An unexpected error occured while verifying the access token`);
        }
    }
};

/**
 * Decodes and validates an access token, ensuring it contains a valid user ID.
 * @param accessToken The access token to decode and validate.
 * @returns The user ID extracted from the token payload.
 * @throws AuthenticationError if the token verification fails.
 * @throws ServerError if the token is valid but does not contain a user ID.
 */
export const decodeAndValidateToken = function (accessToken: string): string {
    // Verify the access token
    const decodedData = verifyAccessToken(accessToken);
    if (!decodedData) throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);

    // Extract the user ID from the decoded token payload
    const { userId } = decodedData;
    if (!userId) throw new ServerError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);

    // Return the user ID for further use
    return userId;
};
