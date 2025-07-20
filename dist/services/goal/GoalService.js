"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const dateFormatter_1 = __importDefault(require("utils/dateFormatter"));
const analyzeWithGemini_1 = require("utils/transaction/analyzeWithGemini");
const generative_ai_1 = require("@google/generative-ai");
const GoalManagementRepository_1 = __importDefault(require("repositories/goal/GoalManagementRepository"));
const eventBus_1 = require("events/eventBus");
class GoalService {
    constructor(goalRepository) {
        this._goalRepository = goalRepository;
    }
    static get instance() {
        if (!GoalService._instance) {
            const repo = GoalManagementRepository_1.default.instance;
            GoalService._instance = new GoalService(repo);
        }
        return GoalService._instance;
    }
    // Creates a new goal for the authenticated user.
    createGoal(accessToken, goalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Add user-related metadata (user_id, created_by, last_updated_by) to the goal data.
                const updatedGoalData = Object.assign({ user_id: userId, created_by: userId, last_updated_by: userId }, goalData);
                // Call the repository to create the goal using the extracted user ID and provided goal data.
                const createdGoal = yield this._goalRepository.createGoal(updatedGoalData);
                // Emit socket event to notify user about new goal created
                eventBus_1.eventBus.emit('goal_created', createdGoal);
                return createdGoal;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error creating goal:', error);
                throw new Error(error.message);
            }
        });
    }
    // Updates an existing goal for the authenticated user.
    updateGoal(accessToken, goalId, goalData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Add user-related metadata (user_id, last_updated_by) to the goal data.
                const updatedGoalData = Object.assign({ user_id: userId, last_updated_by: userId }, goalData);
                // Call the repository to update the goal using the extracted user ID, goal ID, and provided goal data.
                const updatedGoal = yield this._goalRepository.updateGoal(goalId, updatedGoalData);
                // Emit socket event to notify user about goal updation
                eventBus_1.eventBus.emit('goal_updated', updatedGoal);
                return updatedGoal;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error updating goal:', error);
                throw new Error(error.message);
            }
        });
    }
    // Removes an existing goal by its unique identifier.
    removeGoal(goalId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository to remove the goal using the provided goal ID.
                const removedGoal = yield this._goalRepository.removeGoal(goalId);
                // Emit socket event to notify user about goal updation
                eventBus_1.eventBus.emit('goal_removed', removedGoal);
                return removedGoal._id ? true : false;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error removing goal:', error);
                throw new Error(error.message);
            }
        });
    }
    // Retrieves all goals associated with the authenticated user.
    getUserGoals(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goals associated with the extracted user ID.
                const goalDetails = yield this._goalRepository.getUserGoals(userId);
                return goalDetails;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving user goals:', error);
                throw new Error(error.message);
            }
        });
    }
    // Retrieves all goals associated with the authenticated user.
    getTotalActiveGoalAmount(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goals associated with the extracted user ID.
                const goalDetails = yield this._goalRepository.getUserGoals(userId);
                if (goalDetails.length === 0) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                const totalActiveGoalAmount = goalDetails.reduce((sum, goal) => {
                    var _a;
                    if (!goal.is_completed) {
                        sum += ((_a = goal.current_amount) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                return totalActiveGoalAmount;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving user goals:', error);
                throw new Error(error.message);
            }
        });
    }
    // Calculates the total initial (target) amount of all incomplete goals 
    // associated with the authenticated user.
    getTotalInitialGoalAmount(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goals associated with the extracted user ID.
                const goalDetails = yield this._goalRepository.getUserGoals(userId);
                if (goalDetails.length === 0) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                // Calculate the total target amount for incomplete goals
                const totalInitialGoalAmount = goalDetails.reduce((sum, goal) => {
                    var _a;
                    if (!goal.is_completed) {
                        return sum + ((_a = goal.target_amount) !== null && _a !== void 0 ? _a : 0);
                    }
                    return sum;
                }, 0);
                return totalInitialGoalAmount;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error calculating total initial goal amount:', error);
                throw new Error(error.message);
            }
        });
    }
    // Retrieves the longest target time period among incomplete goals associated with the authenticated user.
    findLongestTimePeriod(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Retrieve all goals associated with the extracted user ID from the repository.
                const goalDetails = yield this._goalRepository.getUserGoals(userId);
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
                        formattedDuration = (0, dateFormatter_1.default)(new Date(), new Date(longestGoal.target_date));
                    }
                    else {
                        throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                    }
                }
                else {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_INCOMPLETE_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                return formattedDuration || `0 Y, 0 M, 0 D`;
            }
            catch (error) {
                // Log the error and re-throw it to propagate the error to the caller.
                console.error('Error while calculating the longest target time period:', error);
                throw new Error(error.message);
            }
        });
    }
    // Performs manual SMART analysis when Gemini API is unavailable
    performManualAnalysis(goals) {
        // Initialize aggregates for overall analysis.
        let totalSpecificScore = 0, totalMeasurableScore = 0, totalAchievableScore = 0, totalRelevantScore = 0, totalTimeBoundScore = 0, totalGoals = 0, totalOverallScore = 0;
        // const feedback: Record<string, string> = {};
        const suggestions = [];
        const criteriaScores = {
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
            }
            else if (goal.goal_name && goal.goal_name.length > 3) {
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
            }
            else if (requiredMonthlyContribution <= reasonableThreshold * 1.5) {
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
            }
            else if (monthsRemaining > 60) {
                timeBoundScore = 50;
            }
            totalTimeBoundScore += timeBoundScore;
            // Calculate total score for this goal
            const goalTotalScore = (specificScore * 0.2) +
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
        }
        else {
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
    // Analyzes the SMART compliance of existing goals for the authenticated user.
    analyzeGoal(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Retrieve the goal data from the repository using the user ID.
                const goals = yield this._goalRepository.getUserGoals(userId);
                if (!goals || goals.length === 0) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
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
                    const prompt = (0, analyzeWithGemini_1.createGeminiPrompt)(goals);
                    // Initialize Gemini API
                    const geminiApiKey = process.env.GEMINI_API_KEY || '';
                    const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
                    const geminiApi = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
                    // Call Gemini API
                    const model = geminiApi.getGenerativeModel({ model: geminiModel });
                    const result = yield model.generateContent(prompt);
                    const response = result.response.text();
                    // Parse the response
                    const analysis = (0, analyzeWithGemini_1.parseGeminiResponse)(response);
                    return analysis;
                }
                catch (geminiError) {
                    console.warn('Gemini API failed, falling back to manual analysis:', geminiError);
                    // Fall back to manual analysis
                    return this.performManualAnalysis(goals);
                }
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error analyzing goal:', error);
                throw new Error(error.message);
            }
        });
    }
    goalsByCategory(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goals associated with the extracted user ID.
                const goals = yield this._goalRepository.getUserGoals(userId);
                if (!goals || goals.length === 0) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                const shortTermGoals = [];
                const mediumTermGoals = [];
                const longTermGoals = [];
                // Time thresholds in milliseconds 
                const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
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
                    }
                    else if (timeLeft > ONE_YEAR_IN_MS && timeLeft <= FIVE_YEARS_IN_MS) {
                        mediumTermGoals.push(goal); // Medium-term goal
                    }
                    else {
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
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error categorizing goals:', error);
                throw new Error(error.message);
            }
        });
    }
    dailyContribution(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goals associated with the extracted user ID.
                const goals = yield this._goalRepository.getUserGoals(userId);
                if (!goals || goals.length === 0) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                const totalDailyContribution = goals.reduce((sum, goal) => {
                    var _a;
                    const daysRemaining = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                    let requiredDailyContribution = 0;
                    if (daysRemaining >= 1) {
                        requiredDailyContribution = goal.is_completed ? 0 : ((_a = goal.current_amount) !== null && _a !== void 0 ? _a : 0) / daysRemaining;
                    }
                    return sum + requiredDailyContribution;
                }, 0);
                return totalDailyContribution;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error calculating daily contribution:', error);
                throw new Error(error.message);
            }
        });
    }
    monthlyContribution(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goals associated with the extracted user ID.
                const goals = yield this._goalRepository.getUserGoals(userId);
                if (!goals || goals.length === 0) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                const totalMonthlyContribution = goals.reduce((sum, goal) => {
                    var _a;
                    if (!goal.is_completed) {
                        const monthsRemaining = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
                        let requiredMonthlyContribution = 0;
                        if (monthsRemaining >= 1) {
                            requiredMonthlyContribution = monthsRemaining > 0 ? ((_a = goal.current_amount) !== null && _a !== void 0 ? _a : 0) / monthsRemaining : Infinity;
                        }
                        return sum + requiredMonthlyContribution;
                    }
                    return sum;
                }, 0);
                return totalMonthlyContribution;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error calculating monthly contribution:', error);
                throw new Error(error.message);
            }
        });
    }
    getGoalById(accessToken, goalId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to retrieve the goal by its ID.
                const goal = yield this._goalRepository.getGoalById(goalId);
                if (!goal) {
                    throw new AppError_1.NotFoundError(errorMessages_1.ErrorMessages.NO_GOALS_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                const daysLeftToTargetDate = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                const dailyContribution = goal.is_completed ? 0 : ((_a = goal.current_amount) !== null && _a !== void 0 ? _a : 0) / daysLeftToTargetDate;
                const monthsLeftToTargetDate = Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
                const monthlyContribution = goal.is_completed ? 0 : ((_b = goal.current_amount) !== null && _b !== void 0 ? _b : 0) / monthsLeftToTargetDate;
                const { _id, goal_name, goal_category, target_amount, initial_investment, current_amount, currency, target_date, contribution_frequency, priority_level, description, reminder_frequency, goal_type, tags, dependencies } = goal;
                return { _id, user_id: userId, goal_name, goal_category, target_amount, initial_investment, current_amount, currency, target_date, contribution_frequency, priority_level, description, reminder_frequency, goal_type, tags, dependencies, is_completed: goal.is_completed, created_by: goal.created_by, last_updated_by: (_c = goal.last_updated_by) === null || _c === void 0 ? void 0 : _c.toString(), dailyContribution: dailyContribution || 0, monthlyContribution: monthlyContribution || 0 };
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error retrieving goal by ID:', error);
                throw new Error(error.message);
            }
        });
    }
    updateTransaction(accessToken, goalId, transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID associated with it.
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Call the repository to update the goal contribution by its ID.
                const updatedGoal = yield this._goalRepository.updateTransaction(goalId, transactionData);
                // Emit socket event to notify user about goal updation
                eventBus_1.eventBus.emit('goal_updated', updatedGoal);
                return updatedGoal._id ? true : false;
            }
            catch (error) {
                // Log and re-throw the error to propagate it to the caller.
                console.error('Error updating transaction ID:', error);
                throw new Error(error.message);
            }
        });
    }
    // Retrieves all active goals that require monthly payment notifications.
    getGoalsForNotifyMonthlyGoalPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch goals that are due for monthly payment reminders
                const goals = yield this._goalRepository.getGoalsForNotifyMonthlyGoalPayments();
                // Return the list of goals to be processed for notifications
                return goals;
            }
            catch (error) {
                // Log the error for debugging purposes
                console.error('Error fetching goals for monthly payment notifications:', error);
                // Re-throw the error with a descriptive message
                throw new Error(error.message);
            }
        });
    }
}
exports.default = GoalService;
