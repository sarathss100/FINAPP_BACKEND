"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthService_1 = __importDefault(require("services/auth/AuthService"));
const AuthController_1 = __importDefault(require("controller/auth/AuthController"));
const hash_1 = __importDefault(require("utils/auth/hash"));
const AuthRepository_1 = __importDefault(require("repositories/auth/AuthRepository"));
const router = (0, express_1.Router)();
const authRepository = new AuthRepository_1.default();
const hasher = new hash_1.default();
const authService = new AuthService_1.default(authRepository, hasher);
const authController = new AuthController_1.default(authService);
router.post('/signup', authController.signup.bind(authController));
router.post('/signin', authController.signin.bind(authController));
router.post('/signout', authController.signout.bind(authController));
router.post('/password', authController.resetPassword.bind(authController));
// Verification Routes
router.post('/verifications/token', authController.verifyToken.bind(authController));
router.post('/verifications/phonenumber', authController.verifyPhoneNumber.bind(authController));
exports.default = router;
