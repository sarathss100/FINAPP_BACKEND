import IGoalService from 'services/goal/interfaces/IGoalService';
import IGoalController from './interfaces/IGoalController';
import { sendErrorResponse, sendSuccessResponse } from 'utils/responseHandler';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, AuthenticationError, ServerError, ValidationError } from 'error/AppError';
import goalDTOSchema from 'dtos/goal/GoalDto';
import { SuccessMessages } from 'constants/successMessages';

class GoalController implements IGoalController {
    private readonly _goalService: IGoalService;
    constructor(goalService: IGoalService) {
        this._goalService = goalService;
    }

    async createGoal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Validate the request body using the Zod schema
            const parsedBody = goalDTOSchema.safeParse(request.body);

            if (!parsedBody.success) {
                // If validation fails, extract the error details
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            // Extract the validated data
            const goalData = parsedBody.data;
            
            // Call the service layer to create the goal
            const createdGoal = await this._goalService.createGoal(accessToken, goalData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_PROFILE_PICTURE_UPLOADED, { createdGoal } );
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updateGoal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { goalId } = request.query;
            if (!goalId || typeof goalId !== 'string') {
                throw new ValidationError(ErrorMessages.GOAL_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            const partialGoalDTOSchema = goalDTOSchema.partial();

            // Validate the request body using the Zod schema
            const parsedBody = partialGoalDTOSchema.safeParse(request.body);

            if (!parsedBody.success) {
                // If validation fails, extract the error details
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            // Extract the validated data
            const goalData = parsedBody.data;
            
            // Call the service layer to create the goal
            const createdGoal = await this._goalService.updateGoal(accessToken, goalId, goalData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_PROFILE_PICTURE_UPLOADED, { createdGoal } );
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async removeGoal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { goalId } = request.query;
            if (!goalId || typeof goalId !== 'string') {
                throw new ValidationError(ErrorMessages.GOAL_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            // Call the service layer to delete the goal
            const isRemoved = await this._goalService.removeGoal(goalId);
            if (!isRemoved) {
                throw new ServerError(ErrorMessages.FAILED_TO_DELETE_GOAL);
            }

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_REMOVED);
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getUserGoals(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const userGoalDetails = await this._goalService.getUserGoals(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { ...userGoalDetails });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default GoalController;
