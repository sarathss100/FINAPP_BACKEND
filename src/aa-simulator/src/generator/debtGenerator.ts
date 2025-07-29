import debtTemplates from '../../../aa-simulator/src/data/debt/debtTemplates.json';
import { IDebtDTO } from '../../../dtos/debt/DebtDto';
import IAccountsManagementRepository from '../../../repositories/accounts/interfaces/IAccountsRepository';
import AccountManagementRepository from '../../../repositories/accounts/AccountsRepository';
import IAdminRepository from '../../../repositories/admin/interfaces/IAdminRepository';
import AdminRepository from '../../../repositories/admin/AdminRepository';
import { DebtGeneratorService } from '../services/debtService';

const adminRepository: IAdminRepository = AdminRepository.instance;
const accountsRepository: IAccountsManagementRepository = AccountManagementRepository.instance;

export class DebtGenerator {
    static async getRandomUser() {
        const users = await adminRepository.findAllUsers();
        return (users ?? [])[Math.floor(Math.random() * (users?.length ?? 0))];
    }

    static async getRandomAccount(userId: string) {
        const accounts = await accountsRepository.getUserAccounts(userId);
        return (accounts ?? [])[Math.floor(Math.random() * (accounts?.length ?? 0))];
    }

    static getRandomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    static generateRandomAmount(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static calculateLoanDetails(initialAmount: number, interestRate: number, tenureMonths: number, interestType: 'Flat' | 'Diminishing') {
        const monthlyInterestRate = interestRate / 100 / 12;
        let monthlyPayment = 0;
        let totalInterest = 0;

        if (interestType === 'Flat') {
            totalInterest = initialAmount * (interestRate / 100) * (tenureMonths / 12);
            monthlyPayment = (initialAmount + totalInterest) / tenureMonths;
        } else {
            monthlyPayment = (initialAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenureMonths));
            totalInterest = monthlyPayment * tenureMonths - initialAmount;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + tenureMonths);

        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        return {
            monthlyPayment: Math.round(monthlyPayment),
            totalInterest: Math.round(totalInterest),
            startDate,
            endDate,
            nextDueDate
        };
    }

    static async generateDebt(): Promise<void> {
        try {
            // Pick random user
            const randomUser = await this.getRandomUser();
            
            // Pick random account
            const randomAccount = await this.getRandomAccount(randomUser.userId);

            // Pick random debt template
            const template = this.getRandomFromArray(debtTemplates.templates);

            // Generate loan details
            const debtName = this.getRandomFromArray(template.debtNameOptions);
            const initialAmount = this.generateRandomAmount(template.amountRange[0], template.amountRange[1]);
            const interestRate = parseFloat((Math.random() * (template.interestRateRange[1] - template.interestRateRange[0]) + template.interestRateRange[0]).toFixed(2));
            const tenureMonths = this.generateRandomAmount(template.tenureRange[0], template.tenureRange[1]);
            const interestType = this.getRandomFromArray(template.interestTypeOptions) as 'Flat' | 'Diminishing';
            const isGoodDebt = this.getRandomFromArray(template.isGoodDebtOptions);
            const notes = this.getRandomFromArray(template.notesOptions);

            const { monthlyPayment, totalInterest, startDate, endDate, nextDueDate } = this.calculateLoanDetails(
                initialAmount,
                interestRate,
                tenureMonths,
                interestType
            );

            const debtData: IDebtDTO = {
                _id: '',
                userId: randomUser.userId,
                accountId: randomAccount?._id ? String(randomAccount._id) : null,
                debtName,
                initialAmount,
                currency: template.currency,
                interestRate,
                interestType,
                tenureMonths,
                monthlyPayment,
                monthlyPrincipalPayment: Math.round(monthlyPayment - (totalInterest / tenureMonths)),
                montlyInterestPayment: Math.round(totalInterest / tenureMonths),
                startDate,
                nextDueDate,
                endDate,
                status: 'Active',
                currentBalance: initialAmount,
                totalInterestPaid: 0,
                totalPrincipalPaid: 0,
                additionalCharges: 0,
                notes,
                isDeleted: false,
                isGoodDebt,
                isCompleted: false,
                isExpired: false
            };

            // Submit Debt to main application
            await DebtGeneratorService.submitDebt(debtData, randomUser);

            console.log(`Debt created: ${debtName} for user ${randomUser.userId}`);
        } catch (error) {
            console.error(`Debt generation failed:`, error);
        }
    }
}