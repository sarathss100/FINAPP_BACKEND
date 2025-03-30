import { Request, Response } from "express";
interface IAuthController {
    signup(request: Request, response: Response): Promise<void>;
    verifyToken(request: Request, response: Response): Promise<void>;
    verifyPhoneNumber(request: Request, response: Response): Promise<void>;
    resetPassword(request: Request, response: Response): Promise<void>;
    signin(request: Request, response: Response): Promise<void>;
    signout(request: Request, response: Response): Promise<void>;
}

export default IAuthController;
