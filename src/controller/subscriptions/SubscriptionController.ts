import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError } from 'error/AppError';
import { SuccessMessages } from 'constants/successMessages';
import { ZodError } from 'zod';
import ISubscriptionController from './interfaces/ISubscriptionController';
import ISubscriptionService from 'services/subscriptions/interfaces/ISubscriptionService';
import { initiatePaymentDTOSchema } from 'validation/subscription/subscription.validation';

class SubscriptionController implements ISubscriptionController {
    private readonly _subscriptionService: ISubscriptionService;

    constructor(subscriptionService: ISubscriptionService) {
        this._subscriptionService = subscriptionService;
    }

    async initiatePayment(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            
            // Validate request body against the Zod schema
            const dto = initiatePaymentDTOSchema.parse(request.body);

            // Call the subscription service to initiate the payment and get the Stripe Checkout URL
            const checkoutUrl = await this._subscriptionService.initiatePayment(accessToken, dto);

            // Send success response
            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { checkoutUrl });
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const errorMessages = error.errors.map(err => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');

                sendErrorResponse(response, StatusCodes.BAD_REQUEST, `Validation failed: ${errorMessages}`);
            } else if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                console.error('Unexpected error:', error);
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default SubscriptionController;
