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
exports.requireSubscription = void 0;
// middleware/requireSubscription.ts
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const express_1 = require("express");
const UserRepository_1 = __importDefault(require("repositories/user/UserRepository"));
const tokenUtils_1 = require("utils/auth/tokenUtils");
const responseHandler_1 = require("utils/responseHandler");
const userRepository = new UserRepository_1.default();
const requireSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.cookies;
    if (!authHeader) {
        (0, responseHandler_1.sendErrorResponse)(express_1.response, statusCodes_1.StatusCodes.UNAUTHORIZED, errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND);
        return;
    }
    // Retrieve accessToken from headers
    const accessToken = authHeader.accessToken;
    // Verify access token
    const decoded = (0, tokenUtils_1.verifyAccessToken)(accessToken);
    if (!decoded) {
        (0, responseHandler_1.sendErrorResponse)(express_1.response, statusCodes_1.StatusCodes.UNAUTHORIZED, errorMessages_1.ErrorMessages.TOKEN_VERIFICATION_FAILED);
        return;
    }
    const userId = decoded.userId || '';
    if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    const user = yield userRepository.findByUserId(userId);
    if (!user || !user.subscription_status) {
        res.status(403).json({ success: false, message: 'Premium subscription required' });
        return;
    }
    return next();
});
exports.requireSubscription = requireSubscription;
