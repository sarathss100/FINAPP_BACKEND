import { Router } from 'express';
import IInsuranceController from '../../../controller/insurances/interfaces/IInsuranceController';

const createInsuranceRouter = function(insuranceController: IInsuranceController): Router {
    const router = Router();

    router.get('/', insuranceController.getAllInsurances.bind(insuranceController));
    router.post('/', insuranceController.createInsurance.bind(insuranceController));
    router.delete('/:id', insuranceController.removeInsurance.bind(insuranceController));
    router.get('/coverage/total', insuranceController.getUserInsuranceCoverageTotal.bind(insuranceController));
    router.get('/premium/total', insuranceController.getUserTotalPremiumAmount.bind(insuranceController));
    router.get('/next-payment-date', insuranceController.getClosestNextPaymentDate.bind(insuranceController));
    router.patch('/:id', insuranceController.markPaymentAsPaid.bind(insuranceController));

    return router;
};

export default createInsuranceRouter;

