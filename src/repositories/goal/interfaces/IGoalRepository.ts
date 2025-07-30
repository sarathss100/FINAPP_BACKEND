import IGoalDocument from "../../../model/goal/interfaces/IGoal";

export default interface IGoalRepository {
    createGoal(goalData: Partial<IGoalDocument>): Promise<IGoalDocument>;
    updateGoal(goalId: string, goalData: Partial<IGoalDocument>): Promise<IGoalDocument>;
    removeGoal(goalId: string): Promise<IGoalDocument>;
    getUserGoals(userId: string): Promise<IGoalDocument[]>;
    getGoalById(goalId: string): Promise<IGoalDocument>;
    updateTransaction(goalId: string, transactionData: { amount: number; transaction_id?: string; date?: Date}): Promise<IGoalDocument>;
    getGoalsForNotifyMonthlyGoalPayments(): Promise<IGoalDocument[]>;
}
