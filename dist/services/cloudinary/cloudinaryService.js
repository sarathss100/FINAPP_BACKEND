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
exports.deleteImage = void 0;
const cloudinary_1 = require("cloudinary");
const errorMessages_1 = require("constants/errorMessages");
const AppError_1 = require("error/AppError");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadToCloudinary = function (fileBuffer, originalname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return new Promise((resolve, reject) => {
                // Create a stream from the buffer
                const bufferStream = new stream_1.Stream.PassThrough();
                bufferStream.end(fileBuffer);
                // Use Cloudinary's upload_stream method
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: 'auto',
                    public_id: originalname, // Fixed typo: "puclic_id" -> "public_id" 
                    folder: 'profile_pictures'
                }, (error, result) => {
                    var _a;
                    if (error) {
                        console.error(`Error uploading to Cloudinary:`, error);
                        reject(new AppError_1.ServerError(errorMessages_1.ErrorMessages.CLOUDINARY_IMAGE_UPLOAD_FAILED));
                    }
                    else {
                        resolve((_a = result === null || result === void 0 ? void 0 : result.secure_url) !== null && _a !== void 0 ? _a : "");
                    }
                });
                // Pipe the buffer stream to the upload stream
                bufferStream.pipe(uploadStream);
            });
        }
        catch (error) {
            console.error(`Error uploading to Cloudinary:`, error);
            throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.CLOUDINARY_IMAGE_UPLOAD_FAILED);
        }
    });
};
exports.default = uploadToCloudinary;
const getPublicIdFromUrl = function (url) {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    if (!match || !match[1]) {
        throw new Error('Invalid Cloudinary URL');
    }
    return match[1];
};
const deleteImage = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const publicId = getPublicIdFromUrl(url);
            yield cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            console.error(`Error Deleting Current Profile Image from Cloudinary:`, error);
            throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_DELETE_PROFILE_PICTURE);
        }
    });
};
exports.deleteImage = deleteImage;
