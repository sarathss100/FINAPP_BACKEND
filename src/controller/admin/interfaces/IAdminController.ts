import { Request, Response } from 'express';

interface IAdminController {
    getAllUsers(request: Request, response: Response): Promise<void>;
}

export default IAdminController;
