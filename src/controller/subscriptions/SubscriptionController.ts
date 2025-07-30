import { sendSuccessResponse } from '../../utils/responseHandler';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { SuccessMessages } from '../../constants/successMessages';
import ISubscriptionController from './interfaces/ISubscriptionController';
import ISubscriptionService from '../../services/subscriptions/interfaces/ISubscriptionService';
import { initiatePaymentDTOSchema } from '../../validation/subscription/subscription.validation';
import { handleControllerError } from '../../utils/controllerUtils';

export default class SubscriptionController implements ISubscriptionController {
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

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { checkoutUrl });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}

