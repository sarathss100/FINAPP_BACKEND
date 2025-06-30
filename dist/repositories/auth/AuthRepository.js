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
const UserModel_1 = require("model/user/model/UserModel");
const UserBaseRespository_1 = __importDefault(require("repositories/base/UserBaseRespository"));
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
class AuthRepository extends UserBaseRespository_1.default {
    // Create a new user
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.UserModel.create(data);
            return { userId: user.id, phoneNumber: user.phone_number, status: user.status, role: user.role, is2FA: user.is2FA };
        });
    }
    // Reset Password user by phone number 
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.UserModel.updateOne({ phone_number: data.phone_number }, { $set: { password: data.password } });
            if (!user)
                return null;
            return true;
        });
    }
    // This function is responsible for restore the user account.
    restoreUserAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempts to find the user document by `userId` and updates it to set the `isDeleted` field to `false`.
                const user = yield UserModel_1.UserModel.updateOne({ _id: userId }, { $set: { isDeleted: false } });
                // If fails to restore the user.
                if (!user.acknowledged) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_RESTORE_USER);
                }
            }
            catch (error) {
                // Log the error for debugging purposes, including the `userId` to help trace the issue.
                console.error(`Error while restoring user account for user ID ${userId}:`, error);
                // Re-throw the error to allow upstream error handling mechanisms to manage the issue appropriately.
                throw error;
            }
        });
    }
}
exports.default = AuthRepository;
