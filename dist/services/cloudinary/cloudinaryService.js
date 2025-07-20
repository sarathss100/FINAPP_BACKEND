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
exports.replaceProfilePicture = exports.deleteImageSafely = exports.deleteImage = void 0;
/* eslint-disable no-useless-escape */
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
                    public_id: originalname,
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
    try {
        // Remove any query parameters first
        const urlWithoutQuery = url.split('?')[0];
        // Multiple regex patterns to handle different Cloudinary URL formats
        const patterns = [
            // Standard format: /v1234567890/folder/filename.ext
            /\/v\d+\/(.+)\.\w+$/,
            // Format with transformations: /c_fill,w_100,h_100/v1234567890/folder/filename.ext
            /\/v\d+\/(.+?)(?:\.\w+)?$/,
            // Format without version: /folder/filename.ext
            /\/([^\/]+\/[^\/]+)\.\w+$/,
            // Simple format: /filename.ext
            /\/([^\/]+)\.\w+$/
        ];
        for (const pattern of patterns) {
            const match = urlWithoutQuery.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        // If no pattern matches, try to extract from the path
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
        // Look for version indicator and extract everything after it
        const versionIndex = pathSegments.findIndex(segment => segment.startsWith('v') && /^v\d+$/.test(segment));
        if (versionIndex !== -1 && versionIndex < pathSegments.length - 1) {
            const remainingPath = pathSegments.slice(versionIndex + 1).join('/');
            // Remove file extension
            return remainingPath.replace(/\.[^.]+$/, '');
        }
        // Last resort: use the filename without extension
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment) {
            return lastSegment.replace(/\.[^.]+$/, '');
        }
        throw new Error(`Unable to extract public ID from URL: ${url}`);
    }
    catch (error) {
        console.error('Error parsing Cloudinary URL:', url, error);
        throw new Error(`Invalid Cloudinary URL: ${url}`);
    }
};
const isCloudinaryUrl = function (url) {
    // Check if the URL is a Cloudinary URL
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};
const isLocalAsset = function (url) {
    // Check if it's a local asset (starts with ./ or just filename)
    return url.startsWith('./') || url.startsWith('/') || (!url.includes('http') && !url.includes('cloudinary'));
};
const deleteImage = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        // If no URL provided, skip deletion (no previous image to delete)
        if (!url || url.trim() === '') {
            console.log('No existing image URL provided, skipping deletion');
            return;
        }
        // If it's a local asset (like ./user.png), skip deletion
        if (isLocalAsset(url)) {
            console.log('Local asset detected, skipping deletion:', url);
            return;
        }
        // If it's not a Cloudinary URL, skip deletion
        if (!isCloudinaryUrl(url)) {
            console.log('Non-Cloudinary URL detected, skipping deletion:', url);
            return;
        }
        try {
            console.log('Attempting to delete Cloudinary image with URL:', url);
            const publicId = getPublicIdFromUrl(url);
            console.log('Extracted public ID:', publicId);
            const result = yield cloudinary_1.v2.uploader.destroy(publicId);
            console.log('Cloudinary deletion result:', result);
            if (result.result === 'ok') {
                console.log(`Successfully deleted image with public ID: ${publicId}`);
            }
            else {
                console.log(`Image deletion result: ${result.result} for public ID: ${publicId}`);
            }
        }
        catch (error) {
            console.error(`Error Deleting Current Profile Image from Cloudinary:`, error);
            console.error('URL that caused the error:', url);
            // Note: You might want to decide whether to throw an error here or just log it
            // If deletion fails but upload should continue, you might want to just log the error
            throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_DELETE_PROFILE_PICTURE);
        }
    });
};
exports.deleteImage = deleteImage;
// Alternative version that doesn't throw on deletion failure
const deleteImageSafely = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        // If no URL provided, skip deletion (no previous image to delete)
        if (!url || url.trim() === '') {
            console.log('No existing image URL provided, skipping deletion');
            return true; // Return true as there's nothing to delete
        }
        // If it's a local asset (like ./user.png), skip deletion
        if (isLocalAsset(url)) {
            console.log('Local asset detected, skipping deletion:', url);
            return true; // Return true as local assets don't need deletion
        }
        // If it's not a Cloudinary URL, skip deletion
        if (!isCloudinaryUrl(url)) {
            console.log('Non-Cloudinary URL detected, skipping deletion:', url);
            return true; // Return true as non-Cloudinary URLs don't need deletion
        }
        try {
            const publicId = getPublicIdFromUrl(url);
            const result = yield cloudinary_1.v2.uploader.destroy(publicId);
            console.log(`Successfully deleted image with public ID: ${publicId}`);
            return result.result === 'ok';
        }
        catch (error) {
            console.error(`Error Deleting Current Profile Image from Cloudinary:`, error);
            return false; // Return false but don't throw, allowing upload to continue
        }
    });
};
exports.deleteImageSafely = deleteImageSafely;
// Usage example function that handles the complete flow
const replaceProfilePicture = function (fileBuffer, originalname, existingImageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // First, try to delete the existing image if it exists
            if (existingImageUrl) {
                yield (0, exports.deleteImageSafely)(existingImageUrl); // Using safe version so upload continues even if deletion fails
            }
            // Upload the new image
            const newImageUrl = yield uploadToCloudinary(fileBuffer, originalname);
            return newImageUrl;
        }
        catch (error) {
            console.error('Error in replaceProfilePicture:', error);
            throw error;
        }
    });
};
exports.replaceProfilePicture = replaceProfilePicture;
