import { Request } from 'express';

// Custom Request type with a user property
interface IAuthenticationRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export default IAuthenticationRequest;
