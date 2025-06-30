"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRepository_1 = __importDefault(require("repositories/user/UserRepository"));
const UserService_1 = __importDefault(require("services/user/UserService"));
const UserController_1 = __importDefault(require("controller/user/UserController"));
const multer_1 = __importDefault(require("multer"));
// Initialize Multer with the in Memory Storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
const userRepository = new UserRepository_1.default();
const userService = new UserService_1.default(userRepository);
const userController = new UserController_1.default(userService);
router.get('/me', userController.getUserProfileDetails.bind(userController));
router.get('/me/avatar', userController.getUserProfilePictureUrl.bind(userController));
router.post('/me/avatar', upload.single('file'), userController.uploadProfilePicture.bind(userController));
router.patch('/two-factor', userController.toggleTwoFactorAuthentication.bind(userController));
router.delete('/me', userController.deleteUserAccount.bind(userController));
router.get('/images/:imageId', userController.serveProfileImage.bind(userController));
exports.default = router;
