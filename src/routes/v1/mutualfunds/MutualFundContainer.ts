import IMutualFundController from 'controller/mutualfunds/interfaces/IMutualFundController';
import createMutualFundRouter from './MutualFundRouter';
import MutualFundRepository from 'repositories/mutualfunds/MutualFundRepository';
import MutualFundService from 'services/mutualfunds/MutualFundService';
import MutualFundController from 'controller/mutualfunds/MutualFundController';

class MutualFundContainer {
    public readonly controller: IMutualFundController;
    public readonly router: ReturnType<typeof createMutualFundRouter>;

    constructor() {
        const repository = new MutualFundRepository();
        const service = new MutualFundService(repository);
        this.controller = new MutualFundController(service);
        this.router = createMutualFundRouter(this.controller);
    }
}

export default MutualFundContainer;