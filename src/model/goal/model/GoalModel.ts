import mongoose, { Model } from 'mongoose';
import IGoal from '../interfaces/IGoal';
import GoalSchema from '../schema/GoalSchema';

export const GoalModel: Model<IGoal> = mongoose.model<IGoal>('Goals', GoalSchema);


// Middleware to calculate required_contribution
GoalSchema.pre('save', function (next) {
    if (this.target_amount > 0 && this.initial_investment >= 0 && this.target_date) {
        const monthsToTarget = Math.max(1, (this.target_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
        this.required_contribution = Math.max(0, (this.target_amount - this.initial_investment) / monthsToTarget);
    }
    next();
});

