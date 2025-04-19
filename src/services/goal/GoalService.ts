import { IGoalDTO } from 'dtos/goal/GoalDto';
import IGoalService from './interfaces/IGoalService';
import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import IGoalManagementRepository from 'repositories/goal/interfaces/IGoalManagementRepository';
import { AuthenticationError, AuthorizatonError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';

/**
 * Service class for managing goals, including creating, updating, deleting, and retrieving goals.
 * This class interacts with the goal repository to perform database operations.
 */
class GoalService implements IGoalService {
    private _goalRepository: IGoalManagementRepository;

    /**
     * Constructs a new instance of the GoalService.
     * 
     * @param {IGoalManagementRepository} goalRepository - The repository used for interacting with goal data.
     */
    constructor(goalRepository: IGoalManagementRepository) {
        this._goalRepository = goalRepository;
    }

    /**
     * Creates a new goal for the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @param {IGoalDTO} goalData - The data required to create the goal.
     * @returns {Promise<IGoalDTO>} - A promise resolving to the created goal object.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async createGoal(accessToken: string, goalData: IGoalDTO): Promise<IGoalDTO> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Add user-related metadata (user_id, created_by, last_updated_by) to the goal data.
            const updatedGoalData = { user_id: userId, created_by: userId, last_updated_by: userId, ...goalData };

            // Call the repository to create the goal using the extracted user ID and provided goal data.
            const createdGoal = await this._goalRepository.createGoal(updatedGoalData);

            return createdGoal;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error creating goal:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Updates an existing goal for the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @param {string} goalId - The unique identifier of the goal to be updated.
     * @param {Partial<IGoalDTO>} goalData - The partial data to update the goal with.
     * @returns {Promise<IGoalDTO>} - A promise resolving to the updated goal object.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async updateGoal(accessToken: string, goalId: string, goalData: Partial<IGoalDTO>): Promise<IGoalDTO> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Add user-related metadata (user_id, last_updated_by) to the goal data.
            const updatedGoalData = { user_id: userId, last_updated_by: userId, ...goalData };

            // Call the repository to update the goal using the extracted user ID, goal ID, and provided goal data.
            const updatedGoal = await this._goalRepository.updateGoal(goalId, updatedGoalData);

            return updatedGoal;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error updating goal:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Removes an existing goal by its unique identifier.
     * 
     * @param {string} goalId - The unique identifier of the goal to be removed.
     * @returns {Promise<boolean>} - A promise resolving to `true` if the goal was successfully removed.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async removeGoal(goalId: string): Promise<boolean> {
        try {
            // Call the repository to remove the goal using the provided goal ID.
            const isRemoved = await this._goalRepository.removeGoal(goalId);

            return isRemoved;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error removing goal:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all goals associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<IGoalDTO[]>} - A promise resolving to an array of goal objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getUserGoals(accessToken: string): Promise<IGoalDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the goals associated with the extracted user ID.
            const goalDetails = await this._goalRepository.getUserGoals(userId);

            return goalDetails;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving user goals:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default GoalService;
