import InsuranceRepository from '../../../repositories/insurances/InsuranceRepository';
import IInsuranceController from '../../../controller/insurances/interfaces/IInsuranceController';
import InsuranceService from '../../../services/insurances/InsuranceService';
import InsuranceController from '../../../controller/insurances/InsuranceController';
import createInsuranceRouter from './InsuranceRouter';

export default class InsuranceContainer {
    public readonly controller: IInsuranceController;
    public readonly router: ReturnType<typeof createInsuranceRouter>;

    constructor() {
        const repository = new InsuranceRepository();
        const service = new InsuranceService(repository);
        this.controller = new InsuranceController(service);
        this.router = createInsuranceRouter(this.controller);
    }
}
