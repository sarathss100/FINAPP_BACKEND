import GoalRepository from '../../../repositories/goal/GoalRepository';
import GoalService from '../../../services/goal/GoalService';
import GoalController from '../../../controller/goal/GoalController';
import IGoalController from '../../../controller/goal/interfaces/IGoalController';
import createGoalRouter from './GoalRouter';

class GoalContainer {
    public readonly controller: IGoalController;
    public readonly router: ReturnType<typeof createGoalRouter>;

    constructor() {
        const repository = new GoalRepository();
        const service = new GoalService(repository);
        this.controller = new GoalController(service);
        this.router = createGoalRouter(this.controller);
    }
}

export default GoalContainer;