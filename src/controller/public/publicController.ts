import IPublicService from 'services/public/interfaces/IPublicService';
import IPublicController from './interfaces/IPublicController';
import { StatusCodes } from 'constants/statusCodes';
import { SuccessMessages } from 'constants/successMessages';
import { ErrorMessages } from 'constants/errorMessages';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { Request, Response } from 'express';
import { AppError } from 'error/AppError';

class PublicController implements IPublicController {
    public readonly _publicService: IPublicService;
    constructor(publicService: IPublicService) {
        this._publicService = publicService;
    }

    async getFaqs(request: Request, response: Response): Promise<void> {
        try {
            // Call the getall FAQ details in the publicService
            const faqDetails = await this._publicService.getFaqs();
            
            if (faqDetails) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_FETCHED_SUCCESSFULLY, { faqDetails });
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.FAILED_TO_ADD_THE_FAQ);
            }
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default PublicController;
