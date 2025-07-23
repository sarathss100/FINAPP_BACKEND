import InsuranceManagementRepository from 'repositories/insurances/InsuranceManagementRepository';
import IInsuranceController from 'controller/insurances/interfaces/IInsuranceController';
import InsuranceService from 'services/insurances/InsuranceService';
import InsuranceController from 'controller/insurances/InsuranceController';
import createInsuranceRouter from './InsuranceRouter';

class InsuranceContainer {
    public readonly controller: IInsuranceController;
    public readonly router: ReturnType<typeof createInsuranceRouter>;

    constructor() {
        const repository = new InsuranceManagementRepository();
        const service = new InsuranceService(repository);
        this.controller = new InsuranceController(service);
        this.router = createInsuranceRouter(this.controller);
    }
}

export default InsuranceContainer;
