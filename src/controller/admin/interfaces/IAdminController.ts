import { Request, Response } from 'express';

interface IAdminController {
    getAllUsers(request: Request, response: Response): Promise<void>;
    toggleUserStatus(request: Request, response: Response): Promise<void>;
    addFaq(request: Request, response: Response): Promise<void>;
}

export default IAdminController;
