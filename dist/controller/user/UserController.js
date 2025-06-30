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
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const successMessages_1 = require("constants/successMessages");
const file_type_1 = require("file-type");
class UserController {
    constructor(userService) {
        this._userService = userService;
    }
    getUserProfileDetails(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Call the verifyPhoneNumber method from AuthService
                const userProfileDetails = yield this._userService.getUserProfileDetails(accessToken);
                if (userProfileDetails) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.USER_PROFILE_FETCHED, Object.assign({}, userProfileDetails));
                }
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    uploadProfilePicture(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = request.file; // Multer provides the file object
                const { accessToken } = request.cookies;
                if (!file) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.USER_PROFILE_PICTURE_MISSING_ERROR, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Extract the file path and pass it to the service layer
                const updatedProfilePictureUrl = yield this._userService.updateUserProfilePicture(file, accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.USER_PROFILE_PICTURE_UPLOADED, { profilePictureUrl: updatedProfilePictureUrl });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    getUserProfilePictureUrl(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Extract the file path 
                const userProfilePictureUrl = yield this._userService.getUserProfilePictureUrl(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.USER_PROFILE_PICTURE_URL_FETCHED, { profilePictureUrl: userProfilePictureUrl });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    serveProfileImage(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageId } = request.params;
                if (!imageId) {
                    throw new AppError_1.ValidationError('Image ID is required', statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Get image buffer through service 
                let imageBuffer = yield this._userService.getImageForProxy(imageId);
                // Ensure imageBuffer is a Buffer (not a string)
                if (typeof imageBuffer === 'string') {
                    imageBuffer = Buffer.from(imageBuffer, 'base64');
                }
                // Auto-detect MIME type and file extention
                const detectedFileType = yield (0, file_type_1.fileTypeFromBuffer)(imageBuffer);
                const mimeType = (detectedFileType === null || detectedFileType === void 0 ? void 0 : detectedFileType.mime) || 'application/octet-stream';
                const fileExtension = (detectedFileType === null || detectedFileType === void 0 ? void 0 : detectedFileType.ext) || 'bin';
                // loggin for unsupported formats 
                if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExtension)) {
                    console.warn(`Unsupported image format: ${fileExtension}`);
                }
                // Convert buffer to base64 string
                const base64Image = imageBuffer.toString('base64');
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, 'Image fetched successfully', {
                    image: base64Image,
                    contentType: mimeType,
                    extension: fileExtension,
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    toggleTwoFactorAuthentication(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Extract the file path 
                const isToggled = yield this._userService.toggleTwoFactorAuthentication(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.SUCCESSFULLY_TOGGLED_2FA, { isToggled });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    deleteUserAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // Extract the file path 
                const isDeleted = yield this._userService.deleteUserAccount(accessToken);
                if (!isDeleted) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_DELETE_USER);
                }
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.USER_ACCOUNT_DELETED, { isDeleted });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = UserController;
