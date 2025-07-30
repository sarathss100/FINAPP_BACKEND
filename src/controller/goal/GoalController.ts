import IGoalService from '../../services/goal/interfaces/IGoalService';
import IGoalController from './interfaces/IGoalController';
import { sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AuthenticationError, ServerError, ValidationError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import goalDTOSchema from '../../validation/goal/goal.validation';
import IGoalDTO from '../../dtos/goal/GoalDTO';
import { handleControllerError } from '../../utils/controllerUtils';

export default class GoalController implements IGoalController {
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

            const parsedBody = goalDTOSchema.safeParse(request.body);

            if (!parsedBody.success) {
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            const goalData = parsedBody.data;

            const createdGoal = await this._goalService.createGoal(accessToken, goalData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_CREATED, { createdGoal } );
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async updateGoal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { goalId } = request.params;
            if (!goalId || typeof goalId !== 'string') {
                throw new ValidationError(ErrorMessages.GOAL_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            const partialGoalDTOSchema = goalDTOSchema.partial();

            const parsedBody = partialGoalDTOSchema.safeParse(request.body.goalData);

            if (!parsedBody.success) {
                const errors = parsedBody.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                console.error(errors);

                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
            }

            const goalData = parsedBody.data;

            const createdGoal = await this._goalService.updateGoal(accessToken, goalId, goalData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.USER_GOAL_UPDATED, { createdGoal } );
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async removeGoal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { goalId } = request.params;
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
            handleControllerError(response, error);
        }
    }

    async getUserGoals(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const userGoalDetails: IGoalDTO[] = await this._goalService.getUserGoals(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { ...userGoalDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalActiveGoalAmount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const totalActiveGoalAmount = await this._goalService.getTotalActiveGoalAmount(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { totalActiveGoalAmount });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalInitialGoalAmount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const totalInitialGoalAmount = await this._goalService.getTotalInitialGoalAmount(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { totalInitialGoalAmount });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async findLongestTimePeriod(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const longestTimePeriod = await this._goalService.findLongestTimePeriod(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_LONGEST_TIME_REMAINING, { longestTimePeriod });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async analyzeGoal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const analysisResult = await this._goalService.analyzeGoal(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_ANALYSIS_RESULT, { ...analysisResult });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async goalsByCategory(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const goalsByCategory = await this._goalService.goalsByCategory(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_BY_CATEGORY, { goalsByCategory });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async dailyContribution(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const dailyContribution = await this._goalService.dailyContribution(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_DAILY_CONTRIBUTION, { dailyContribution });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async monthlyContribution(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            // Call the service layer to get the user goals
            const monthlyContribution = await this._goalService.monthlyContribution(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_MONTHLY_CONTRIBUTION, { monthlyContribution });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getGoalById(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { goalId } = request.params;
            
            if (!goalId || typeof goalId !== 'string') {
                throw new ValidationError(ErrorMessages.GOAL_ID_NOT_FOUND, StatusCodes.BAD_REQUEST);
            } 

            // Call the service layer to get the user goals
            const goalDetails = await this._goalService.getGoalById(accessToken, goalId);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOALS_RETRIEVED, { goalDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async updateTransaction(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            if (!accessToken) {
                throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
            }

            const { transaction_id, amount, date, goalId } = request.body;
            const transactionData = {
                ...(transaction_id && { transaction_id }),
                ...(date && { date }),
                amount,
            };

            // Call the service layer to update the user goal transaction
            const isUpdated = await this._goalService.updateTransaction(accessToken, goalId, transactionData);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.GOAL_TRANSACTION_UPDATED, { isUpdated });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}


