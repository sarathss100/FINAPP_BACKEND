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
                    public_id: originalname,  // Fixed typo: "puclic_id" -> "public_id" 
                    folder: 'profile_pictures' 
                },
                (error, result) => {
                    if (error) {
                        console.error(`Error uploading to Cloudinary:`, error);
                        reject(new ServerError(ErrorMessages.CLOUDINARY_IMAGE_UPLOAD_FAILED));
                    } else {
                        resolve(result?.secure_url??"");
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
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    
    if (!match || !match[1]) {
        throw new Error('Invalid Cloudinary URL');
    }

    return match[1];
}

export const deleteImage = async function (url: string) {
    try {
        const publicId = getPublicIdFromUrl(url);
        await cloudinaryV2.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error Deleting Current Profile Image from Cloudinary:`, error);
        throw new ServerError(ErrorMessages.FAILED_TO_DELETE_PROFILE_PICTURE);
    }
} 
