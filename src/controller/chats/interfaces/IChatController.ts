import { Request, Response } from 'express';

interface IChatController {
    createChat(request: Request, response: Response): Promise<void>;
}

export default IChatController;
