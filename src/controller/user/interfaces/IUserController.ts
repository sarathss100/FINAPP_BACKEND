import { Request, Response } from 'express';

interface IUserController {
    getUserProfileDetails(request: Request, response: Response): Promise<void>;
}

export default IUserController;
