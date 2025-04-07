import { ServerError } from '../../error/AppError';
import uploadToCloudinary from './cloudinaryService';
import { ErrorMessages } from '../../constants/errorMessages';

// Mock cloudinaryV2 module
jest.mock('cloudinary', () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            upload: jest.fn()
        }
    }
}));

describe('uploadToCloudinary', () => {
    const mockFilePath = 'path/to/image.jpg';
    const mockCloudinaryResponse = {
        secure_url: 'https://cloudinary.com/image.jpg'
    };

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock ennvironment variables
        process.env.CLOUDINARY_CLOUD_NAME = 'mock-cloud-name';
        process.env.CLOUDINARY_API_KEY = 'mock-api-key';
        process.env.CLOUDINARY_API_SECRET = 'mock-api-secret';
    });

    it(`Should successfully upload an image and return the secure URL`, async () => {
        // Mock successful upload response
        const { upload } = require('cloudinary').v2.uploader;
        upload.mockResolvedValue(mockCloudinaryResponse);

        // Call the function
        const result = await uploadToCloudinary(mockFilePath);

        // Assertions 
        expect(upload).toHaveBeenCalledWith(mockFilePath, { resource_type: 'auto' });
        expect(result).toBe(mockCloudinaryResponse.secure_url);
    });

    it('should throw a ServerError when the upload fails', async () => {
        // Mock upload failure
        const { upload } = require('cloudinary').v2.uploader;
        const mockError = new Error('Cloudinary upload failed');
        upload.mockRejectedValue(mockError);

        // Call the function and expect it to throw
        await expect(uploadToCloudinary(mockFilePath)).rejects.toThrow(ServerError);
        await expect(uploadToCloudinary(mockFilePath)).rejects.toThrow(ErrorMessages.CLOUDINARY_IMAGE_UPLOAD_FAILED);

        // Assertions 
        expect(upload).toHaveBeenCalledWith(mockFilePath, { resource_type: 'auto' });
    });
});
