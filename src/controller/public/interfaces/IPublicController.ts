import { Request, Response } from 'express';

interface IPublicController {
    getFaqs(request: Request, response: Response): Promise<void>;
}

export default IPublicController;
