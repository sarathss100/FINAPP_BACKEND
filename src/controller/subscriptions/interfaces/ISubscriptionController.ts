import { Request, Response } from 'express';

export default interface ISubscriptionController {
    initiatePayment(request: Request, response: Response): Promise<void>;
}
