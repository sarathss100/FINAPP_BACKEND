import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { AuthenticationError, ServerError } from '../../error/AppError';
import jwt from 'jsonwebtoken';
import IAuthUser from '../../services/auth/interfaces/IAuthUser';
import ITokenPayload from '../../types/auth/ITokenPayload';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFERSH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFERSH_TOKEN_SECRET) {
    throw new Error(`Missing required environment variables: ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET`);
}

export const generateAccessToken = function (user: IAuthUser): string {
    return jwt.sign(
        { userId: user.userId, phoneNumber: user.phoneNumber, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '40m' }
    )
};

export const generateRefreshToken = function (user: IAuthUser): string {
    return jwt.sign(
        { userId: user.userId, phoneNumber: user.phoneNumber, role: user.role },
        REFERSH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
};

export const verifyAccessToken = function (token: string): ITokenPayload {
    try {
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

export const verifyRefreshToken = function (token: string): ITokenPayload {
    try {
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

export const decodeAndValidateToken = function (accessToken: string): string {
    const decodedData = verifyAccessToken(accessToken);
    if (!decodedData) throw new AuthenticationError(ErrorMessages.TOKEN_VERIFICATION_FAILED, StatusCodes.UNAUTHORIZED);

    const { userId } = decodedData;
    if (!userId) throw new ServerError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);

    return userId;
};
