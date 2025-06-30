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
const GoalModel_1 = require("model/goal/model/GoalModel");
const mongoose_1 = __importDefault(require("mongoose"));
class GoalManagementRepository {
    /**
    * Creates a new goal in the database and returns the created goal in IGoalDTO format.
    *
    * This method takes an input object (`goalData`) containing goal details, inserts it into the database using the `GoalModel`,
    * and maps the result to the `IGoalDTO` format. MongoDB ObjectIds are converted to strings for consistency in the DTO.
    *
    * @param {IGoalDTO} goalData - The input data representing the goal to be created. Must conform to the IGoalDTO structure.
    * @returns {Promise<IGoalDTO>} - A promise resolving to the created goal in IGoalDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails or if invalid data is provided.
    */
    createGoal(goalData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const result = yield GoalModel_1.GoalModel.create(goalData);
                const createdGoal = {
                    user_id: result.user_id.toString(),
                    tenant_id: (_a = result.tenant_id) === null || _a === void 0 ? void 0 : _a.toString(),
                    goal_name: result.goal_name,
                    goal_category: result.goal_category,
                    target_amount: result.target_amount,
                    initial_investment: result.initial_investment,
                    current_amount: result.current_amount,
                    currency: result.currency,
                    target_date: result.target_date,
                    contribution_frequency: result.contribution_frequency,
                    priority_level: result.priority_level,
                    description: result.description,
                    reminder_frequency: result.reminder_frequency,
                    goal_type: result.goal_type,
                    tags: result.tags,
                    dependencies: (_b = result.dependencies) === null || _b === void 0 ? void 0 : _b.map(dep => dep.toString()),
                    is_completed: result.is_completed,
                    created_by: result.created_by.toString(),
                    last_updated_by: (_c = result.last_updated_by) === null || _c === void 0 ? void 0 : _c.toString(),
                };
                return createdGoal;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
    * Updates an existing goal in the database and returns the updated goal in IGoalDTO format.
    *
    * This method takes an input object (`goalData`) containing updated goal details, finds the goal by `user_id`,
    * and updates it in the database using the `GoalModel`. The updated result is mapped to the `IGoalDTO` format,
    * with MongoDB ObjectIds converted to strings for consistency.
    *
     * @param {IGoalDTO} goalData - The input data representing the goal to be updated. Must include `user_id` to identify the goal.
    * @returns {Promise<IGoalDTO>} - A promise resolving to the updated goal in IGoalDTO format, with ObjectIds converted to strings.
    * @throws {Error} - Throws an error if the database operation fails, the goal is not found, or invalid data is provided.
    */
    updateGoal(goalId, goalData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Perform the update operation
                const result = yield GoalModel_1.GoalModel.findOneAndUpdate({ _id: goalId }, Object.assign({}, goalData), { new: true });
                // Handle case where no goal is found
                if (!result) {
                    throw new Error('Goal not found');
                }
                // Map the updated result to IGoalDTO format
                const updatedGoal = {
                    user_id: result.user_id.toString(),
                    tenant_id: (_a = result.tenant_id) === null || _a === void 0 ? void 0 : _a.toString(),
                    goal_name: result.goal_name,
                    goal_category: result.goal_category,
                    target_amount: result.target_amount,
                    initial_investment: result.initial_investment,
                    current_amount: result.current_amount,
                    currency: result.currency,
                    target_date: result.target_date,
                    contribution_frequency: result.contribution_frequency,
                    priority_level: result.priority_level,
                    description: result.description,
                    reminder_frequency: result.reminder_frequency,
                    goal_type: result.goal_type,
                    tags: result.tags,
                    dependencies: (_b = result.dependencies) === null || _b === void 0 ? void 0 : _b.map(dep => dep.toString()),
                    is_completed: result.is_completed,
                    created_by: result.created_by.toString(),
                    last_updated_by: (_c = result.last_updated_by) === null || _c === void 0 ? void 0 : _c.toString(),
                };
                return updatedGoal;
            }
            catch (error) {
                console.error('Error updating goal:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
    * Removes an existing goal from the database.
    *
    * @param {string} goalId - The unique identifier of the goal to be removed.
    * @returns {Promise<boolean>} - A promise resolving to `true` if the goal was successfully removed.
    * @throws {Error} - Throws an error if the database operation fails or the goal is not found.
    */
    removeGoal(goalId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform the deletion operation
                const result = yield GoalModel_1.GoalModel.findOneAndDelete({ _id: goalId }, { new: true });
                // Handle case where no goal is found
                if (!result) {
                    throw new Error('Goal not found');
                }
                return true;
            }
            catch (error) {
                console.error('Error updating goal:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves all goals associated with a specific user from the database.
     *
     * @param {string} userId - The unique identifier of the user whose goals are being retrieved.
     * @returns {Promise<IGoalDTO[]>} - A promise resolving to an array of `IGoalDTO` objects representing the user's goals.
     * @throws {Error} - Throws an error if the database operation fails or no goals are found for the given user.
     */
    getUserGoals(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to retrieve all goals associated with the given `userId`.
                const result = yield GoalModel_1.GoalModel.find({ user_id: userId });
                // it means no goals were found for the given user, and an error is thrown.
                if (!result || result.length === 0) {
                    throw new Error('No goals found for the specified user');
                }
                // Return the retrieved goals as an array of `IGoalDTO` objects.
                return result;
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving goal details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
    /**
    * Retrieves a specific goal from the database based on its unique identifier.
    *
    * @param {string} goalId - The unique identifier of the goal to retrieve.
    * @returns {Promise<IGoalDTO>} - A promise resolving to an `IGoalDTO` object representing the retrieved goal.
    * @throws {Error} - Throws an error if the database operation fails or no goal is found for the given `goalId`.
    */
    getGoalById(goalId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(goalId);
                // Query the database to retrieve the goal associated with the given `goalId`.
                const result = yield GoalModel_1.GoalModel.findOne({ _id: goalId });
                // If no goal is found for the given `goalId`, throw an error.
                if (!result) {
                    throw new Error('No goal found for the specified ID');
                }
                // Return the retrieved goal as an `IGoalDTO` object.
                return result;
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving goal details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
    /**
    * Updates a goal by recording a new contribution and deducting the transaction amount from the current goal amount.
    *
    * @param {string} goalId - The unique identifier of the goal to update.
    * @param {Object} transactionData - Data related to the transaction being applied to the goal.
    * @param {number} transactionData.amount - The amount to deduct from the goal's current amount and record as a contribution.
    * @param {string} [transactionData.transaction_id] - Optional transaction ID to associate with the contribution.
    * @param {Date} [transactionData.date] - Optional date for the contribution (not currently used in this method).
    * @returns {Promise<boolean>} - A promise resolving to `true` if the update was successful, otherwise `false`.
    * @throws {Error} - Throws an error if the database operation fails.
    */
    updateTransaction(goalId, transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const goal = yield GoalModel_1.GoalModel.findOne({ _id: goalId });
                const newContribution = {
                    transaction_id: transactionData.transaction_id
                        ? new mongoose_1.default.Types.ObjectId(transactionData.transaction_id)
                        : new mongoose_1.default.Types.ObjectId(),
                    amount: transactionData.amount
                };
                if (Number(goal === null || goal === void 0 ? void 0 : goal.current_amount) <= transactionData.amount) {
                    const result = yield GoalModel_1.GoalModel.findOneAndUpdate({ _id: goalId }, {
                        $push: { contributions: newContribution },
                        $inc: { current_amount: -transactionData.amount },
                        $set: { is_completed: true }
                    }, {
                        new: true
                    });
                    return result ? true : false;
                }
                else {
                    const result = yield GoalModel_1.GoalModel.findOneAndUpdate({ _id: goalId }, {
                        $push: { contributions: newContribution },
                        $inc: { current_amount: -transactionData.amount }
                    }, {
                        new: true
                    });
                    return result ? true : false;
                }
            }
            catch (error) {
                console.error('Error updating transaction:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = GoalManagementRepository;
