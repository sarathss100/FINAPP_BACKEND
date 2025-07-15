/* eslint-disable no-useless-escape */
import { v2 as cloudinaryV2 } from 'cloudinary';
import { ErrorMessages } from 'constants/errorMessages';
import { ServerError } from 'error/AppError';
import { Stream as stream } from 'stream';

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async function (fileBuffer: Buffer, originalname: string): Promise<string> {
    try {
        return new Promise((resolve, reject) => {
            // Create a stream from the buffer
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileBuffer);
            
            // Use Cloudinary's upload_stream method
            const uploadStream = cloudinaryV2.uploader.upload_stream(
                { 
                    resource_type: 'auto', 
                    public_id: originalname,
                    folder: 'profile_pictures' 
                },
                (error, result) => {
                    if (error) {
                        console.error(`Error uploading to Cloudinary:`, error);
                        reject(new ServerError(ErrorMessages.CLOUDINARY_IMAGE_UPLOAD_FAILED));
                    } else {
                        resolve(result?.secure_url ?? "");
                    }
                }
            );
            
            // Pipe the buffer stream to the upload stream
            bufferStream.pipe(uploadStream);
        });
    } catch (error) {
        console.error(`Error uploading to Cloudinary:`, error);
        throw new ServerError(ErrorMessages.CLOUDINARY_IMAGE_UPLOAD_FAILED);
    }
};

export default uploadToCloudinary;

const getPublicIdFromUrl = function (url: string): string {
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
    } catch (error) {
        console.error('Error parsing Cloudinary URL:', url, error);
        throw new Error(`Invalid Cloudinary URL: ${url}`);
    }
}

const isCloudinaryUrl = function (url: string): boolean {
    // Check if the URL is a Cloudinary URL
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

const isLocalAsset = function (url: string): boolean {
    // Check if it's a local asset (starts with ./ or just filename)
    return url.startsWith('./') || url.startsWith('/') || (!url.includes('http') && !url.includes('cloudinary'));
}

export const deleteImage = async function (url: string | null | undefined): Promise<void> {
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
        
        const result = await cloudinaryV2.uploader.destroy(publicId);
        console.log('Cloudinary deletion result:', result);
        
        if (result.result === 'ok') {
            console.log(`Successfully deleted image with public ID: ${publicId}`);
        } else {
            console.log(`Image deletion result: ${result.result} for public ID: ${publicId}`);
        }
    } catch (error) {
        console.error(`Error Deleting Current Profile Image from Cloudinary:`, error);
        console.error('URL that caused the error:', url);
        // Note: You might want to decide whether to throw an error here or just log it
        // If deletion fails but upload should continue, you might want to just log the error
        throw new ServerError(ErrorMessages.FAILED_TO_DELETE_PROFILE_PICTURE);
    }
}

// Alternative version that doesn't throw on deletion failure
export const deleteImageSafely = async function (url: string | null | undefined): Promise<boolean> {
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
        const result = await cloudinaryV2.uploader.destroy(publicId);
        console.log(`Successfully deleted image with public ID: ${publicId}`);
        return result.result === 'ok';
    } catch (error) {
        console.error(`Error Deleting Current Profile Image from Cloudinary:`, error);
        return false; // Return false but don't throw, allowing upload to continue
    }
}

// Usage example function that handles the complete flow
export const replaceProfilePicture = async function (
    fileBuffer: Buffer, 
    originalname: string, 
    existingImageUrl?: string | null
): Promise<string> {
    try {
        // First, try to delete the existing image if it exists
        if (existingImageUrl) {
            await deleteImageSafely(existingImageUrl); // Using safe version so upload continues even if deletion fails
        }

        // Upload the new image
        const newImageUrl = await uploadToCloudinary(fileBuffer, originalname);
        
        return newImageUrl;
    } catch (error) {
        console.error('Error in replaceProfilePicture:', error);
        throw error;
    }
}