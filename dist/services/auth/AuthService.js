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
const tokenUtils_1 = require("utils/auth/tokenUtils");
const RedisService_1 = __importDefault(require("services/redis/RedisService"));
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const signup_validation_1 = require("validation/auth/signup.validation");
const resetPassword_validation_1 = require("validation/auth/resetPassword.validation");
const signin_validation_1 = require("validation/auth/signin.validation");
class AuthService {
    constructor(authRepository, hasher) {
        this._authRepository = authRepository;
        this._hasher = hasher;
    }
    signup(signupData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate signup data
                signup_validation_1.SignupSchema.parse(signupData);
                const existingUser = yield this._authRepository.findByPhoneNumber(signupData.phone_number);
                if (existingUser) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.USER_ALREADY_EXISTS, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Hash the password
                const hashedPassword = yield this._hasher.hash(signupData.password);
                // Create the user
                const userData = Object.assign(Object.assign({}, signupData), { password: hashedPassword });
                const createUser = yield this._authRepository.createUser(userData);
                // Generate tokens using the utility functions 
                let accessToken, refreshToken;
                try {
                    accessToken = (0, tokenUtils_1.generateAccessToken)(createUser);
                    refreshToken = (0, tokenUtils_1.generateRefreshToken)(createUser);
                }
                catch (error) {
                    if (error) {
                        throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.TOKEN_GENERATION_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                }
                if (!accessToken || !refreshToken)
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.TOKEN_GENERATION_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                //Store the refresh token in Redis with a TTL 
                const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
                try {
                    yield RedisService_1.default.storeRefreshToken(createUser.userId, refreshToken, REFRESH_TOKEN_TTL);
                }
                catch (error) {
                    if (error) {
                        // Roll back user creation if Redis fails 
                        yield RedisService_1.default.deleteRefreshToken(createUser.userId);
                        throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.REFRESH_TOKEN_STORAGE_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                }
                // Send the response to the controler 
                return Object.assign(Object.assign({}, createUser), { accessToken });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
            ;
        });
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedData = (0, tokenUtils_1.verifyAccessToken)(token);
                if (!decodedData)
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.TOKEN_VERIFICATION_FAILED, statusCodes_1.StatusCodes.UNAUTHORIZED);
                const { phoneNumber } = decodedData;
                const getUserDetails = yield this._authRepository.findByPhoneNumber(phoneNumber);
                if (!getUserDetails)
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR, statusCodes_1.StatusCodes.BAD_REQUEST);
                decodedData.status = getUserDetails === null || getUserDetails === void 0 ? void 0 : getUserDetails.status;
                return decodedData;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
        });
    }
    signin(signinData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate signup data
                signin_validation_1.SigninSchema.parse(signinData);
                const user = yield this._authRepository.findByPhoneNumber(signinData.phone_number);
                if (!user) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.USER_NOT_FOUND, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                if (user && user.status === false) {
                    throw new AppError_1.ForbiddenError(errorMessages_1.ErrorMessages.USER_IS_BLOCKED);
                }
                const hashedPasswordInDatabase = user.hashedPassword;
                const userProvidedPassword = signinData.password;
                // Check whether the password matches
                const isMatched = yield this._hasher.verify(userProvidedPassword, hashedPasswordInDatabase);
                if (!isMatched) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_CREDENTIALS, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                yield this._authRepository.restoreUserAccount(user.userId);
                // Generate tokens using the utility functions 
                let accessToken, refreshToken;
                try {
                    accessToken = (0, tokenUtils_1.generateAccessToken)(user);
                    refreshToken = (0, tokenUtils_1.generateRefreshToken)(user);
                }
                catch (error) {
                    if (error)
                        throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.TOKEN_GENERATION_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                if (!accessToken || !refreshToken)
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.TOKEN_GENERATION_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                //Store the refresh token in Redis with a TTL 
                const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
                try {
                    yield RedisService_1.default.storeRefreshToken(user.userId, refreshToken, REFRESH_TOKEN_TTL);
                }
                catch (error) {
                    if (error)
                        throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.REFRESH_TOKEN_STORAGE_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                // Send the response to the controller 
                return Object.assign(Object.assign({}, user), { accessToken });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
            ;
        });
    }
    signout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedUserDetails = yield this.verifyToken(token);
                const userId = verifiedUserDetails.userId;
                if (!userId) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.STATUS_CHECK_FAILED, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                const isRefreshTokenRemoved = yield RedisService_1.default.deleteRefreshToken(userId);
                if (!isRefreshTokenRemoved) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.REFRESH_TOKEN_REMOVAL_ERROR, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                return true;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
        });
    }
    verifyPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!phoneNumber)
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.PHONE_NUMBER_MISSING, statusCodes_1.StatusCodes.BAD_REQUEST);
                const userDetails = yield this._authRepository.findByPhoneNumber(phoneNumber);
                if ((userDetails === null || userDetails === void 0 ? void 0 : userDetails.status) === false)
                    throw new AppError_1.ForbiddenError(errorMessages_1.ErrorMessages.USER_IS_BLOCKED);
                return !!(userDetails === null || userDetails === void 0 ? void 0 : userDetails.status);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
        });
    }
    getUserDetails(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedUserDetails = yield this.verifyToken(accessToken);
                const userId = verifiedUserDetails.userId;
                if (!userId) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.STATUS_CHECK_FAILED, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                const userDetails = yield this._authRepository.getUserDetails(userId);
                if ((userDetails === null || userDetails === void 0 ? void 0 : userDetails.status) === false)
                    throw new AppError_1.ForbiddenError(errorMessages_1.ErrorMessages.USER_IS_BLOCKED);
                return userDetails;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
        });
    }
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the data
                resetPassword_validation_1.ResetPasswordSchema.parse(data);
                const user = yield this._authRepository.findByPhoneNumber(data.phone_number);
                if (!user) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.PHONE_NUMBER_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const hashedPasswordInDatabase = user.hashedPassword;
                const userProvidedPassword = data.password;
                // Check whether the password matches
                const isMatched = yield this._hasher.verify(userProvidedPassword, hashedPasswordInDatabase);
                if (isMatched) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.PASSWORD_MATCH_ERROR, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Hash the password
                const hashedPassword = yield this._hasher.hash(data.password);
                // Update the data with hashedPassword and send to repository layer
                const userData = Object.assign(Object.assign({}, data), { password: hashedPassword });
                const isUpdated = yield this._authRepository.resetPassword(userData);
                return !!isUpdated;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.default = AuthService;
