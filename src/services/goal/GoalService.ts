import { IGoalDTO } from 'dtos/goal/GoalDto';
import IGoalService from './interfaces/IGoalService';
import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import IGoalManagementRepository from 'repositories/goal/interfaces/IGoalManagementRepository';
import { AuthenticationError, NotFoundError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import formatDuration from 'utils/dateFormatter';
import ISmartAnalysisResult from './interfaces/ISmartAnalysisResult';
import IGoalCategory from './interfaces/IGoalCategory';
import { createGeminiPrompt, parseGeminiResponse } from 'utils/transaction/analyzeWithGemini';
import { GoogleGenerativeAI } from '@google/generative-ai';
import GoalManagementRepository from 'repositories/goal/GoalManagementRepository';

/**
 * Service class for managing goals, including creating, updating, deleting, and retrieving goals.
 * This class interacts with the goal repository to perform database operations.
 */
class GoalService implements IGoalService {
    private static _instance: GoalService;
    private _goalRepository: IGoalManagementRepository;

    /**
     * Constructs a new instance of the GoalService.
     * 
     * @param {IGoalManagementRepository} goalRepository - The repository used for interacting with goal data.
     */
    constructor(goalRepository: IGoalManagementRepository) {
        this._goalRepository = goalRepository;
    }

    public static get instance(): GoalService {
        if (!GoalService._instance) {
            const repo = GoalManagementRepository.instance;
            GoalService._instance = new GoalService(repo);
        }
        return GoalService._instance;
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

    /**
     * Retrieves all goals associated with the authenticated user.
     * 
     * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
     * @returns {Promise<IGoalDTO[]>} - A promise resolving to an array of goal objects associated with the user.
     * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getTotalActiveGoalAmount(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the goals associated with the extracted user ID.
            const goalDetails = await this._goalRepository.getUserGoals(userId);

            const totalActiveGoalAmount = goalDetails.reduce((sum, goal) => {
                if (!goal.is_completed) {
                    sum += (goal.current_amount ?? 0);
                }
                return sum;
            }, 0);

            return totalActiveGoalAmount;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving user goals:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
    * Retrieves the longest target time period among incomplete goals associated with the authenticated user.
    * 
    * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
    * @returns {Promise<void>} - A promise that resolves when the operation completes. Logs the longest time period.
    * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
    * @throws {Error} - Throws an error if the database operation fails or if there is an issue processing the goals.
    */
    async findLongestTimePeriod(accessToken: string): Promise<string> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Retrieve all goals associated with the extracted user ID from the repository.
            const goalDetails = await this._goalRepository.getUserGoals(userId);

            // Calculate the longest target time period among incomplete goals.
            let longestTimePeriod = 0;
            let longestGoal = null;
            let formattedDuration = '';

            for (const goal of goalDetails) {
                if (!goal.is_completed) {
                   // Calculate the time left as the difference between target_date and the current date.
                    const timeLeft = new Date(goal.target_date).getTime() - new Date().getTime();

                    if (timeLeft > longestTimePeriod) {
                        longestTimePeriod = timeLeft; // Update the longest time period
                        longestGoal = goal; // Track the goal with the longest time left
                    }
                }
            }

            if (longestTimePeriod > 0) {
                // Format the longest time period into a human-readable string
                if (longestGoal) {
                    formattedDuration = formatDuration(new Date(), new Date(longestGoal.target_date));
                } else {
                    throw new NotFoundError(ErrorMessages.NO_GOALS_FOUND, StatusCodes.NOT_FOUND);
                }
            } else {
                throw new NotFoundError(ErrorMessages.NO_INCOMPLETE_GOALS_FOUND, StatusCodes.NOT_FOUND);
            }
        
            return formattedDuration || `0 Y, 0 M, 0 D`;
        } catch (error) {
            // Log the error and re-throw it to propagate the error to the caller.
            console.error('Error while calculating the longest target time period:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Performs manual SMART analysis when Gemini API is unavailable
     * @param {any[]} goals - Array of user goals to analyze
     * @returns {ISmartAnalysisResult} - Manual analysis result
     */
    private performManualAnalysis(goals: IGoalDTO[]): ISmartAnalysisResult {
        // Initialize aggregates for overall analysis.
        let totalSpecificScore = 0,
            totalMeasurableScore = 0,
            totalAchievableScore = 0,
            totalRelevantScore = 0,
            totalTimeBoundScore = 0,
            totalGoals = 0,
            totalOverallScore = 0;

        // const feedback: Record<string, string> = {};
        const suggestions: string[] = [];
        const criteriaScores: Record<string, number> = {
            specific: 0,
            measurable: 0,
            achievable: 0,
            relevant: 0,
            timeBound: 0,
        };

        // Analyze each goal and aggregate scores
        for (const goal of goals) {
            if (goal.is_completed) {
                continue; // Skip completed goals
            }
            totalGoals++; // Increment the total number of goals

            // Evaluate Specific
            let specificScore = 0;
            if (goal.goal_name && goal.goal_name.length > 0) {
                specificScore = 100;
            } else if (goal.goal_name && goal.goal_name.length > 3) {
                specificScore = 50;
            }
            totalSpecificScore += specificScore;

            // Evaluate Measurable
            let measurableScore = 0;
            if (goal.target_amount && goal.target_amount > 0) {
                measurableScore = 100;
            }
            totalMeasurableScore += measurableScore;

            // Evaluate Achievable
            let achievableScore = 0;
            const monthsRemaining = Math.max(0, (new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
            const requiredMonthlyContribution = monthsRemaining > 0 ? goal.target_amount / monthsRemaining : Infinity;
            const reasonableThreshold = 0.3 * 50000;

            if (requiredMonthlyContribution <= reasonableThreshold) {
                achievableScore = 100;
            } else if (requiredMonthlyContribution <= reasonableThreshold * 1.5) {
                achievableScore = 50;
            }
            totalAchievableScore += achievableScore;

            // Evaluate Relevant
            let relevantScore = 0;
            switch (goal.priority_level) {
                case 'High':
                    relevantScore = 100;
                    break;
                case 'Medium':
                    relevantScore = 50;
                    break;
            }
            totalRelevantScore += relevantScore;

            // Evaluate Time-bound
            let timeBoundScore = 0;
            if (new Date(goal.target_date) > new Date()) {
                timeBoundScore = 100;
            } else if (monthsRemaining > 60) {
                timeBoundScore = 50;
            }
            totalTimeBoundScore += timeBoundScore;

            // Calculate total score for this goal
            const goalTotalScore =
                (specificScore * 0.2) +
                (measurableScore * 0.2) +
                (achievableScore * 0.25) +
                (relevantScore * 0.15) +
                (timeBoundScore * 0.2);

            totalOverallScore += goalTotalScore;

            // Add suggestions if needed
            if (specificScore < 100) {
                suggestions.push(`Improve the specificity of the goal: "${goal.goal_name}".`);
            }
            if (measurableScore < 100) {
                suggestions.push(`Set a measurable target amount for the goal: "${goal.goal_name}".`);
            }
            if (achievableScore < 100) {
                suggestions.push(`Adjust the target date or amount for the goal: "${goal.goal_name}" to make it achievable.`);
            }
            if (relevantScore < 100) {
                suggestions.push(`Increase the priority level of the goal: "${goal.goal_name}" to make it more relevant.`);
            }
            if (timeBoundScore < 100) {
                suggestions.push(`Set a realistic target date for the goal: "${goal.goal_name}".`);
            }
        }

        // Calculate average scores
        if (totalGoals > 0) {
            criteriaScores.specific = Math.round(totalSpecificScore / totalGoals);
            criteriaScores.measurable = Math.round(totalMeasurableScore / totalGoals);
            criteriaScores.achievable = Math.round(totalAchievableScore / totalGoals);
            criteriaScores.relevant = Math.round(totalRelevantScore / totalGoals);
            criteriaScores.timeBound = Math.round(totalTimeBoundScore / totalGoals);

            const overallScore = Math.round(totalOverallScore / totalGoals);

            return {
                isSmartCompliant: overallScore === 100,
                feedback: {
                    Overall: `Your overall SMART score is ${overallScore} out of 100 (Manual Analysis).`,
                },
                suggestions,
                totalScore: overallScore,
                criteriaScores,
            };
        } else {
            return {
                isSmartCompliant: false,
                feedback: {
                    Overall: `No goals found to analyze.`,
                },
                suggestions: [],
                totalScore: 0,
                criteriaScores: {
                    specific: 0,
                    measurable: 0,
                    achievable: 0,
                    relevant: 0,
                    timeBound: 0,
                },
            };
        }
    }

    /**
    * Analyzes the SMART compliance of existing goals for the authenticated user.
    * 
    * @param {string} accessToken - The access token used to authenticate the user and extract their ID.
    * @returns {Promise<ISmartAnalysisResult>} - A promise resolving to an analysis result object containing SMART scores, feedback, and suggestions.
    * @throws {AuthenticationError} - Throws an error if the access token is invalid or missing the user ID.
    * @throws {NotFoundError} - Throws an error if no goals are found for the user.
    * @throws {Error} - Throws an error if the database operation fails or an unexpected error occurs during analysis.
    */
    async analyzeGoal(accessToken: string): Promise<ISmartAnalysisResult> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Retrieve the goal data from the repository using the user ID.
            const goals = await this._goalRepository.getUserGoals(userId);
            if (!goals || goals.length === 0) {
                throw new NotFoundError(ErrorMessages.NO_GOALS_FOUND, StatusCodes.NOT_FOUND);
            }

            // If there are no active goals (all completed), return early
            const activeGoals = goals.filter(goal => !goal.is_completed);

            if (activeGoals.length === 0) {
                return {
                    isSmartCompliant: false,
                    feedback: {
                        Overall: `No active goals found to analyze.`,
                    },
                    suggestions: [],
                    totalScore: 0,
                    criteriaScores: {
                        specific: 0,
                        measurable: 0,
                        achievable: 0,
                        relevant: 0,
                        timeBound: 0,
                    },
                };
            }

            // Try Gemini API first, fall back to manual mode if it fails
            try {
                // Create prompt for Gemini API
                const prompt = createGeminiPrompt(goals);

                // Initialize Gemini API
                const geminiApiKey = process.env.GEMINI_API_KEY || '';
                const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
                const geminiApi = new GoogleGenerativeAI(geminiApiKey);

                // Call Gemini API
                const model = geminiApi.getGenerativeModel({ model: geminiModel });
                const result = await model.generateContent(prompt);
                const response = result.response.text();

                console.log('Gemini API response:', response);

                // Parse the response
                const analysis = parseGeminiResponse(response);

                return analysis;
            } catch (geminiError) {
                console.warn('Gemini API failed, falling back to manual analysis:', geminiError);
                
                // Fall back to manual analysis
                return this.performManualAnalysis(goals);
            }
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error analyzing goal:', error);
            throw new Error((error as Error).message);
        }
    }

    async goalsByCategory(accessToken: string): Promise<IGoalCategory> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the goals associated with the extracted user ID.
            const goals = await this._goalRepository.getUserGoals(userId);
            if (!goals || goals.length === 0) {
                throw new NotFoundError(ErrorMessages.NO_GOALS_FOUND, StatusCodes.NOT_FOUND);
            }

            const shortTermGoals: IGoalDTO[] = [];
            const mediumTermGoals: IGoalDTO[] = []; 
            const longTermGoals: IGoalDTO[] = [];

            // Time thresholds in milliseconds 
            const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000
            const ONE_YEAR_IN_MS = 365 * ONE_DAY_IN_MS;
            const FIVE_YEARS_IN_MS = 5 * ONE_YEAR_IN_MS;
            
            // Iterate through the goals and categorize based on time difference
            for (const goal of goals) {
                if (goal.is_completed) {
                    continue; // Skip completed goals
                } 
                const targetDate = new Date(goal.target_date).getTime(); // Target date in milliseconds 
                const currentDate = Date.now(); // Current date in milliseconds
                const timeLeft = targetDate - currentDate; // Time difference in milliseconds

                if (timeLeft <= 0) {
                    // Skip expired goals
                    continue;
                }

                if (timeLeft <= ONE_YEAR_IN_MS) {
                    shortTermGoals.push(goal); // Short-term goal
                } else if (timeLeft > ONE_YEAR_IN_MS && timeLeft <= FIVE_YEARS_IN_MS) {
                    mediumTermGoals.push(goal); // Medium-term goal
                } else {
                    longTermGoals.push(goal); // Long-term goal
                }
            }

            const shortTermGoalsTargetAmount = shortTermGoals.reduce((sum, goal) => sum + goal.target_amount, 0);
            const mediumTermGoalsTargetAmount = mediumTermGoals.reduce((sum, goal) => sum + goal.target_amount, 0);         
            const longTermGoalsTargetAmount = longTermGoals.reduce((sum, goal) => sum + goal.target_amount, 0);
            const shortTermGoalsCurrntAmount = shortTermGoals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0);
            const mediumTermGoalsCurrntAmount = mediumTermGoals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0); 
            const longTermGoalsCurrntAmount = longTermGoals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0);

            return { shortTermGoalsCurrntAmount, shortTermGoalsTargetAmount, mediumTermGoalsCurrntAmount, mediumTermGoalsTargetAmount, longTermGoalsCurrntAmount, longTermGoalsTargetAmount };
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error categorizing goals:', error);
            throw new Error((error as Error).message);
        }
    }

    async dailyContribution(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the goals associated with the extracted user ID.
            const goals = await this._goalRepository.getUserGoals(userId);
            if (!goals || goals.length === 0) {
                throw new NotFoundError(ErrorMessages.NO_GOALS_FOUND, StatusCodes.NOT_FOUND);
            }

            const totalDailyContribution = goals.reduce((sum, goal) => {
                const daysRemaining = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                let requiredDailyContribution = 0;
                if (daysRemaining >= 1) {
                    requiredDailyContribution = goal.is_completed ? 0 : (goal.current_amount ?? 0) / daysRemaining;
                }
                return sum + requiredDailyContribution;
            }, 0);

            return totalDailyContribution;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error calculating daily contribution:', error);
            throw new Error((error as Error).message);
        }
    }

    async monthlyContribution(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the goals associated with the extracted user ID.
            const goals = await this._goalRepository.getUserGoals(userId);
            if (!goals || goals.length === 0) {
                throw new NotFoundError(ErrorMessages.NO_GOALS_FOUND, StatusCodes.NOT_FOUND);
            }

            const totalMonthlyContribution = goals.reduce((sum, goal) => {
                if (!goal.is_completed) {
                    const monthsRemaining = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
                    let requiredMonthlyContribution = 0;
                    if (monthsRemaining >= 1) {
                        requiredMonthlyContribution = monthsRemaining > 0 ? (goal.current_amount ?? 0) / monthsRemaining : Infinity;
                    }
                    return sum + requiredMonthlyContribution;
                }
                return sum;
            }, 0);

            return totalMonthlyContribution;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error calculating monthly contribution:', error);
            throw new Error((error as Error).message);
        }
    }

    async getGoalById(accessToken: string, goalId: string): Promise<IGoalDTO> { 
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to retrieve the goal by its ID.
            const goal = await this._goalRepository.getGoalById(goalId);
            if (!goal) {
                throw new NotFoundError(ErrorMessages.NO_GOALS_FOUND, StatusCodes.NOT_FOUND);
            }

            const daysLeftToTargetDate = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            const dailyContribution = goal.is_completed ? 0 : (goal.current_amount ?? 0) / daysLeftToTargetDate;

            const monthsLeftToTargetDate = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
            const monthlyContribution = goal.is_completed ? 0 : (goal.current_amount ?? 0) / monthsLeftToTargetDate;
            
            const { _id, goal_name, goal_category, target_amount, initial_investment, current_amount, currency, target_date, contribution_frequency, priority_level, description, reminder_frequency, goal_type, tags, dependencies } = goal;
            return { _id, user_id: userId, goal_name, goal_category, target_amount, initial_investment, current_amount, currency, target_date, contribution_frequency, priority_level, description, reminder_frequency, goal_type, tags, dependencies, is_completed: goal.is_completed, created_by: goal.created_by, last_updated_by: goal.last_updated_by?.toString(), dailyContribution: dailyContribution || 0, monthlyContribution: monthlyContribution || 0 };
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error retrieving goal by ID:', error);
            throw new Error((error as Error).message);
        }
    }

    async updateTransaction(accessToken: string, goalId: string, transactionData: { amount: number; transaction_id?: string; date?: Date }): Promise<boolean> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Call the repository to update the goal contribution by its ID.
            const isUpdated = await this._goalRepository.updateTransaction(goalId, transactionData);

            return isUpdated;
        } catch (error) {
            // Log and re-throw the error to propagate it to the caller.
            console.error('Error updating transaction ID:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all active goals that require monthly payment notifications.
     *
     * This method is typically used by a scheduled job or notification system
     * to identify goals that need a monthly payment reminder based on their schedule.
     *
     * @returns {Promise<IGoalDTO[]>} A promise resolving to an array of goal DTOs that are eligible for monthly payment alerts.
     * @throws {Error} If an error occurs during the repository call or data retrieval process.
     */
    async getGoalsForNotifyMonthlyGoalPayments(): Promise<IGoalDTO[]> {
        try {
            // Fetch goals that are due for monthly payment reminders
            const goals = await this._goalRepository.getGoalsForNotifyMonthlyGoalPayments();

            // Return the list of goals to be processed for notifications
            return goals;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error fetching goals for monthly payment notifications:', error);

            // Re-throw the error with a descriptive message
            throw new Error((error as Error).message);
        }
    }
}

export default GoalService;
