import { Types } from 'mongoose';
import IGoalDocument from '../../model/goal/interfaces/IGoal';
import IGoalDTO from '../../dtos/goal/GoalDTO';

export default class GoalMapper {
  // Convert Mongo document to DTO
  static toDTO(data: IGoalDocument): IGoalDTO {
    return {
      _id: data._id.toString(),
      user_id: data.user_id?.toString(),
      tenant_id: data.tenant_id?.toString(),
      goal_name: data.goal_name,
      goal_category: data.goal_category,
      target_amount: data.target_amount,
      initial_investment: data.initial_investment,
      current_amount: data.current_amount,
      currency: data.currency,
      target_date: data.target_date,
      contribution_frequency: data.contribution_frequency,
      priority_level: data.priority_level,
      description: data.description,
      reminder_frequency: data.reminder_frequency,
      goal_type: data.goal_type,
      tags: data.tags,
      dependencies: data.dependencies?.map(t => t.toString()),
      is_completed: data.is_completed,
      created_by: data.created_by.toString(),
      last_updated_by: data.last_updated_by?.toString(),
      dailyContribution: 0,
      monthlyContribution: 0,
    };
  }

  // Convert array of Mongo documents to DTOs
  static toDTOs(data: IGoalDocument[]): IGoalDTO[] {
    return data.map(item => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: Partial<IGoalDTO>): Partial<IGoalDocument> {
    const model: Partial<IGoalDocument> = {
      goal_name: dto.goal_name,
      goal_category: dto.goal_category,
      target_amount: dto.target_amount,
      initial_investment: dto.initial_investment,
      current_amount: dto.current_amount,
      currency: dto.currency,
      target_date: dto.target_date,
      contribution_frequency: dto.contribution_frequency,
      priority_level: dto.priority_level,
      description: dto.description,
      reminder_frequency: dto.reminder_frequency,
      goal_type: dto.goal_type,
      tags: dto.tags,
      dependencies: dto.dependencies?.map(t => new Types.ObjectId(t)),
      is_completed: dto.is_completed,
      created_by: new Types.ObjectId(dto.created_by),
      last_updated_by: new Types.ObjectId(dto.last_updated_by),
    };

    if (dto._id) model._id = new Types.ObjectId(dto._id);
    if (dto.user_id) model.user_id = new Types.ObjectId(dto.user_id);
    if (dto.tenant_id) model.tenant_id = new Types.ObjectId(dto.tenant_id);

    return model;
  }
}
