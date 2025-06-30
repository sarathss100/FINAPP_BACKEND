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
const UserBaseRespository_1 = __importDefault(require("repositories/base/UserBaseRespository"));
const UserModel_1 = require("model/user/model/UserModel");
const AppError_1 = require("error/AppError");
const mongoose_1 = require("mongoose");
const errorMessages_1 = require("constants/errorMessages");
class UserRepository extends UserBaseRespository_1.default {
    // Find a user's profile information by their unique user ID.
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.UserModel.findOne({ _id: userId });
            if (!user)
                return null;
            return { userId: user.id, firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number, is2FA: user.is2FA, profilePictureUrl: user.profile_picture_url };
        });
    }
    // Updates the profile picture URL for a specific user in the database.
    updateUserProfileImageData(userId, imageUrl, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.UserModel.updateOne({ _id: userId }, { $set: { profile_picture_url: imageUrl, profile_picture_id: imageId } });
            return user.acknowledged;
        });
    }
    // Retrieves the profile picture URL for a specific user in the database.
    getUserProfileImageData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.UserModel.findOne({ _id: userId }, { _id: 0, profile_picture_url: 1, profile_picture_id: 1 });
            if (!(user === null || user === void 0 ? void 0 : user.profile_picture_url))
                return null;
            return { imageUrl: user.profile_picture_url, imageId: user.profile_picture_id };
        });
    }
    // Get image URL by image ID (for proxy serving)
    getImageUrlById(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.UserModel.findOne({ profile_picture_id: imageId }, { _id: 0, profile_picture_url: 1 });
            return (user === null || user === void 0 ? void 0 : user.profile_picture_url) || null;
        });
    }
    // Toggles the Two-Factor Authentication (2FA) status for a specific user in the database.
    toggleTwoFactorAuthentication(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the current user document to get the current `is2FA` value
                const user = yield UserModel_1.UserModel.findOne({ _id: userId }, { is2FA: 1 });
                if (!user) {
                    throw new mongoose_1.Error(`User with ID ${userId} not found.`);
                }
                // Toggle the `is2FA` value
                const newIs2FAValue = !user.is2FA;
                // Update the database with the new `is2FA` value
                yield UserModel_1.UserModel.updateOne({ _id: userId }, { $set: { is2FA: newIs2FAValue } });
                // Return the latest `is2FA` value
                return newIs2FAValue;
            }
            catch (error) {
                console.error(`Error toggling 2FA for user ID ${userId}:`, error);
                throw error; // Re-throw the error for upstream handling
            }
        });
    }
    // This function is responsible for marking a user account as deleted in the database.
    deleteUserAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempts to find the user document by `userId` and updates it to set the `isDeleted` field to `true`.
                const user = yield UserModel_1.UserModel.updateOne({ _id: userId }, { $set: { isDeleted: true } });
                // If no user is found with the given `userId`, throw a `NotFoundError` with an appropriate error message.
                if (!user.acknowledged) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.USER_NOT_FOUND);
                }
                // If the operation is successful, return `true` to indicate that the account deletion process was completed.
                return true;
            }
            catch (error) {
                // Log the error for debugging purposes, including the `userId` to help trace the issue.
                console.error(`Error while deleting user account for user ID ${userId}:`, error);
                // Re-throw the error to allow upstream error handling mechanisms to manage the issue appropriately.
                throw error;
            }
        });
    }
}
exports.default = UserRepository;
