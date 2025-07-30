import insuranceTemplates from '../../../aa-simulator/src/data/insurance/insuranceTemplates.json';
import IAdminRepository from '../../../repositories/admin/interfaces/IAdminRepository';
import AdminRepository from '../../../repositories/admin/AdminRepository';
import { InsuranceDTO } from '../../../dtos/insurances/insuranceDTO';
import { InsuranceGeneratorService } from '../services/insuranceService';
import UserMapper from '../../../mappers/user/UserMapper';

const adminRepository: IAdminRepository = AdminRepository.instance;

export class InsuranceGenerator {
    static async getRandomUser() {
        const users = await adminRepository.findAllUsers();
        return (users ?? [])[Math.floor(Math.random() * (users?.length ?? 0))];
    }

    static getRandomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    static generateRandomAmount(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static async generateInsurance(): Promise<void> {
        try {
            // Pick random user
            const randomUser = await this.getRandomUser();
            const resultDTO = UserMapper.toIAuthUserDTO(randomUser);

            // Pick random insurance template
            const template = this.getRandomFromArray(insuranceTemplates.templates);

            // Generate insurance details
            const insuranceType = template.type;
            const coverage = this.generateRandomAmount(template.coverageRange[0], template.coverageRange[1]);
            const premium = this.generateRandomAmount(template.premiumRange[0], template.premiumRange[1]);
            const paymentStatus = this.getRandomFromArray(template.paymentStatusOptions);
            const status = this.getRandomFromArray(template.statusOptions);

            // Set next payment date (if payment is not 'Paid')
            const nextPaymentDate = new Date();
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

            const insuranceData: InsuranceDTO = {
                userId: resultDTO.userId,
                type: insuranceType,
                coverage,
                premium,
                next_payment_date: paymentStatus === 'Paid' ? new Date() : nextPaymentDate,
                payment_status: paymentStatus,
                status
            };

            // Submit Insurance to main application
            await InsuranceGeneratorService.submitInsurance(insuranceData, resultDTO);

            console.log(`Insurance created: ${insuranceType} for user ${resultDTO.userId}`);
        } catch (error) {
            console.error(`Insurance generation failed:`, error);
        }
    }
}