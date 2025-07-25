import AdminRepository from "../../../repositories/admin/AdminRepository";
import IAdminRepository from "../../../repositories/admin/interfaces/IAdminRepository";
import transactionTemplates from '../../../aa-simulator/src/data/transaction/transactionTemplates.json';
import { TransactionPayload } from "../data/transaction/types";
import { ITransactionDTO } from "../../../dtos/transaction/TransactionDto";
import { TransactionGeneratorService } from "../services/transactionService";
import IAccountsManagementRepository from "../../../repositories/accounts/interfaces/IAccountsManagementRepository";
import AccountManagementRepository from "../../../repositories/accounts/AccountsManagementRepository";

const adminRepository: IAdminRepository = AdminRepository.instance;
const accountsRepository: IAccountsManagementRepository = AccountManagementRepository.instance;

export class TransactionGenerator {
    static async getRandomUser() {
        const users = await adminRepository.findAllUsers();
        return (users ?? [])[Math.floor(Math.random() * (users?.length ?? 0))]
    }

    static async getRandomAccount(useId: string) {
        const accounts = await accountsRepository.getUserAccounts(useId);
        return (accounts ?? [])[Math.floor(Math.random() * (accounts?.length ?? 0))];
    }

    static getRandomTemplate() {
        const templates = transactionTemplates.templates;
        return templates[Math.floor(Math.random() * templates.length)];
    }

    static generateRandomAmount(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    static async generateTransaction(): Promise<void> {
        try {
            // Pick random user
            const randomUser = await this.getRandomUser();

            // Pick random account
            const randomAccount = await this.getRandomAccount(randomUser.userId);
            if (!randomAccount?._id) {
                throw new Error('No valid account found for user');
            }

            // Pick random transaction template
            const template = this.getRandomTemplate();

            // Generate random amount within template range
            const amount = this.generateRandomAmount(
                template.amountRange[0],
                template.amountRange[1]
            );

            // Pick random description from template
            const description = this.getRandomFromArray(template.descriptions);

            const statusRandom = 'COMPLETED';

            // Build transaction payload
            const transactionData: ITransactionDTO = {
                user_id: randomUser.userId,
                account_id: randomAccount._id,
                transaction_type: template.transaction_type as "EXPENSE" | "INCOME",
                type: template.type as TransactionPayload['type'],
                category: template.category as TransactionPayload['category'],
                amount: amount,
                currency: 'INR',
                date: new Date(),
                description: description,
                tags: template.tags,
                status: statusRandom,
                transactionHash: '',
                isDeleted: false,
            };

            // Submit transaction to main application
            await TransactionGeneratorService.submitTransaction(transactionData, randomUser);

        } catch (error) {
            console.error(`Transaction generation failed:`, error);
            throw error;
        }
    }
};