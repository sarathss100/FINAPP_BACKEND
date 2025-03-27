import { Request, Response } from "express";

interface IAuthController {
    signup(request: Request, response: Response): Promise<void>;
    verifyToken(request: Request, response: Response): Promise<void>;
}

export default IAuthController;
