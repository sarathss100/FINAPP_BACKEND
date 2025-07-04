import { Router } from 'express';
import InsuranceManagementRepository from 'repositories/insurances/InsuranceManagementRepository';
import IInsuranceController from 'controller/insurances/interfaces/IInsuranceController';
import InsuranceService from 'services/insurances/InsuranceService';
import InsuranceController from 'controller/insurances/InsuranceController';

const router = Router();
const insuranceRepository = new InsuranceManagementRepository();
const insuranceService = new InsuranceService(insuranceRepository);
const insuranceController: IInsuranceController = new InsuranceController(insuranceService);

router.get('/', insuranceController.getAllInsurances.bind(insuranceController));
router.post('/', insuranceController.createInsurance.bind(insuranceController));
router.delete('/:id', insuranceController.removeInsurance.bind(insuranceController));
router.get('/coverage/total', insuranceController.getUserInsuranceCoverageTotal.bind(insuranceController));
router.get('/premium/total', insuranceController.getUserTotalPremiumAmount.bind(insuranceController));
router.get('/next-payment-date', insuranceController.getClosestNextPaymentDate.bind(insuranceController));
router.patch('/:id', insuranceController.markPaymentAsPaid.bind(insuranceController));

export default router;

