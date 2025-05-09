import { Request, Response } from 'express';

interface IAdminController {
    getAllUsers(request: Request, response: Response): Promise<void>;
    toggleUserStatus(request: Request, response: Response): Promise<void>;
    addFaq(request: Request, response: Response): Promise<void>;
    getAllFaqs(request: Request, response: Response): Promise<void>;
    getNewRegistrationCount(request: Request, response: Response): Promise<void>;
    getHealthStatus(request: Request, response: Response): Promise<void>;
    getSystemMetrics(request: Request, respons: Response): Promise<void>;
}

export default IAdminController;
