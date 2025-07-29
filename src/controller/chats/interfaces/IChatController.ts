import { Request, Response } from 'express';

export default interface IChatController {
    createChat(request: Request, response: Response): Promise<void>;
    getAccessToken(request: Request, response: Response): Promise<void>;
}
