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
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("utils/responseHandler");
const statusCodes_1 = require("constants/statusCodes");
const successMessages_1 = require("constants/successMessages");
const errorMessages_1 = require("constants/errorMessages");
const AppError_1 = require("error/AppError");
const AppError_2 = require("error/AppError");
// import { httpOnlyCookieOptions } from 'utils/cookiesOptions';
class AuthController {
    constructor(authService) {
        this._authService = authService;
    }
    signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupData = request.body;
                // Call the signup method from AuthService
                const result = yield this._authService.signup(signupData);
                // Extract the accessToken from the result
                const { accessToken, userId, role } = result;
                // Set the accessToken as an HTTP-only cookie
                response.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
                // Set the user ID, role and LoggedIn state as an HTTP-only cookie
                response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
                // Send a success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.SIGNUP_SUCCESS, { userId, role });
            }
            catch (error) {
                if (error instanceof AppError_2.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    verifyToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract the cookie from the request headers
                const authHeader = request.headers.cookie;
                // Check if the cookie exists
                if (!authHeader) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.AUTH_COOKIE_MISSING, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Parse the cookie to extract 
                const parsedAuthHeader = JSON.parse(authHeader);
                const { accessToken } = parsedAuthHeader;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const verificationStatus = yield this._authService.verifyToken(accessToken);
                if (!verificationStatus) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.TOKEN_VERIFICATION_FAILED, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TOKEN_VERIFIED, { valid: true, status: verificationStatus.status });
            }
            catch (error) {
                if (error instanceof AppError_2.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    signin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signinData = request.body;
                // Call the signup method from AuthService
                const result = yield this._authService.signin(signinData);
                // Extract the accessToken from the result
                const { accessToken, userId, role, is2FA } = result;
                // Set the accessToken as an HTTP-only cookie
                response.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
                // Cookie for user metadata 
                response.cookie('userMetaData', JSON.stringify({ userId, role, isLoggedIn: true }), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
                // Send a success response
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.CREATED, successMessages_1.SuccessMessages.SIGNIN_SUCCESS, { userId, role, is2FA });
            }
            catch (error) {
                if (error instanceof AppError_2.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    signout(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Call the signout method from AuthService
                const signoutStatus = yield this._authService.signout(accessToken);
                if (!signoutStatus) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.SIGNOUT_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
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
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.SIGNOUT_SUCCESS);
            }
            catch (error) {
                if (error instanceof AppError_2.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    verifyPhoneNumber(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber } = request.body;
                if (!phoneNumber) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.PHONE_NUMBER_MISSING, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the verifyPhoneNumber method from AuthService
                const isVerifiedPhoneNumber = yield this._authService.verifyPhoneNumber(phoneNumber);
                if (!isVerifiedPhoneNumber)
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_NOT_FOUND, statusCodes_1.StatusCodes.BAD_REQUEST);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.PHONE_NUMBER_VERIFIED);
            }
            catch (error) {
                if (error instanceof AppError_2.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    resetPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = request.body;
                // Call the verifyPhoneNumber method from AuthService
                const isPasswordResetted = yield this._authService.resetPassword(data);
                if (!isPasswordResetted)
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.PASSWORD_RESET_FAILED, statusCodes_1.StatusCodes.BAD_REQUEST);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.PASSWORD_RESET_SUCCESS);
            }
            catch (error) {
                if (error instanceof AppError_2.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = AuthController;
