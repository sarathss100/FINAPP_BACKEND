"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const tokenUtils_1 = require("../../utils/auth/tokenUtils");
const AppError_1 = require("../../error/AppError");
const statusCodes_1 = require("constants/statusCodes");
const errorMessages_1 = require("constants/errorMessages");
const authenticate = (socket, next) => {
    var _a, _b;
    const accessToken = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = socket.handshake.query) === null || _b === void 0 ? void 0 : _b.accessToken);
    if (!accessToken) {
        return next(new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED));
    }
    try {
        const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
        if (!userId) {
            throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
        }
        socket.data.userId = userId;
        socket.data.accessToken = accessToken;
        next();
    }
    catch (error) {
        console.error('Socket authentication failed:', error);
        next(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
};
exports.authenticate = authenticate;
