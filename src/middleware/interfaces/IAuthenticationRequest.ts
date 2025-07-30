import { Request } from 'express';

interface IAuthenticationRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export default IAuthenticationRequest;
