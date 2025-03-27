import jwt from 'jsonwebtoken';
import IAuthUser from 'services/auth/interfaces/IAuthUser';
import ITokenPayload from 'types/ITokenPayload';

// Token secret keys 
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'Secret';
const REFERSH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'secret';

/**
 * Generates an access token for a user.
 * @param user The user object for whom the token is generated.
 * @returns A signed JWT access token.
 */
export const generateAccessToken = function (user: IAuthUser): string {
    return jwt.sign(
        { userId: user.userId, phoneNumber: user.phoneNumber },
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
        { userId: user.userId, phoneNumber: user.phoneNumber },
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
        const decode = jwt.verify(token, ACCESS_TOKEN_SECRET);
        
        return decode as ITokenPayload;
    } catch (tokenError) {
        throw new Error(`Invalid or expired access token`);
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
    } catch (tokenError) {
        throw new Error(`Invalid or expired refresh token`); 
    }
};
