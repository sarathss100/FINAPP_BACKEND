import { Request, Response } from 'express';

interface IUserController {
    getUserProfileDetails(request: Request, response: Response): Promise<void>;
    uploadProfilePicture(request: Request, response: Response): Promise<void>;
    getUserProfilePictureUrl(request: Request, response: Response): Promise<void>;
}

export default IUserController;
