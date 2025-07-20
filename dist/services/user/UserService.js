"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const cloudinaryService_1 = __importStar(require("services/cloudinary/cloudinaryService"));
const generateUniqueId_1 = __importDefault(require("utils/user/generateUniqueId"));
class UserService {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }
    getUserProfileDetails(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and Validate the token
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                const profileDetails = yield this._userRepository.findByUserId(userId);
                if (!profileDetails)
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.FETCH_USER_PROFILE_FAILED, statusCodes_1.StatusCodes.BAD_REQUEST);
                return profileDetails;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateUserProfilePicture(file, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the token
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!file || !file.buffer)
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.USER_PROFILE_PICTURE_MISSING_ERROR, statusCodes_1.StatusCodes.BAD_REQUEST);
                // Get Current Cloudinary UserId 
                const imageData = yield this._userRepository.getUserProfileImageData(userId);
                const currentCloudinaryUrl = imageData === null || imageData === void 0 ? void 0 : imageData.imageUrl;
                if (currentCloudinaryUrl) {
                    // Delete the current profile picture 
                    yield (0, cloudinaryService_1.deleteImage)(currentCloudinaryUrl);
                }
                // Upload the image to Cloudinary
                const cloudinaryUrl = yield (0, cloudinaryService_1.default)(file.buffer, file.originalname);
                // Generate unique image ID 
                const imageId = (0, generateUniqueId_1.default)();
                // Save the Cloudinary URL in the database
                const isProfilePictureUpdated = yield this._userRepository.updateUserProfileImageData(userId, cloudinaryUrl, imageId);
                if (!isProfilePictureUpdated)
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_UPLOAD_PROFILE_PICTURE, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                // Return proxy URL instead of direct Cloudinary URL 
                const proxyUrl = `${process.env.BASE_URL}/api/user/images/${imageId}`;
                return proxyUrl;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getUserProfilePictureUrl(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the token
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Extract the profile picture url from the database
                const imageData = yield this._userRepository.getUserProfileImageData(userId);
                if (!imageData) {
                    // Return proxy URL for default image 
                    return `${process.env.BASE_URL}/api/user/images/default`;
                }
                // Return proxy URL
                const proxyUrl = `${process.env.BASE_URL}/api/v1/user/images/${imageData.imageId}`;
                return proxyUrl;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getImageForProxy(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl;
                if (imageId === 'default') {
                    // Handle default image
                    imageUrl = '';
                    return imageUrl;
                }
                else {
                    // Get actual Cloudinary URL from database 
                    const fetchedImageUrl = yield this._userRepository.getImageUrlById(imageId);
                    if (!fetchedImageUrl) {
                        throw new Error(`Image not found`);
                    }
                    imageUrl = fetchedImageUrl;
                }
                // Fetch image from Cloudinary
                const response = yield fetch(imageUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const arrayBuffer = yield response.arrayBuffer();
                return Buffer.from(arrayBuffer);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    toggleTwoFactorAuthentication(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the token
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Toggle User Two Factor Authentcation (2FA) status for a user in the repository layer.
                const isToggled = yield this._userRepository.toggleTwoFactorAuthentication(userId);
                return isToggled; // Return the Success status
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteUserAccount(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the token
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                // Delete User Account for a user in the repository layer.
                const isDeleted = yield this._userRepository.deleteUserAccount(userId);
                return isDeleted; // Return the Success status
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = UserService;
