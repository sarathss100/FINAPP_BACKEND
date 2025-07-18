import { Request, Response } from 'express';

interface ISubscriptionController {
    initiatePayment(request: Request, response: Response): Promise<void>;
}

export default ISubscriptionController;
