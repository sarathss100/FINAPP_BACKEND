import { generateAccessToken } from "../../../utils/auth/tokenUtils";
import IUserDetails from "../../../repositories/admin/interfaces/IUserDetails";
import { IDebtDTO } from "../../../dtos/debt/DebtDto";
import IDebtService from "../../../services/debt/interfaces/IDebtService";
import DebtService from "../../../services/debt/DebtService";

const debtService: IDebtService = DebtService.instance;

export class DebtGeneratorService {
    // private static BASE_URL = process.env.BASE_URL;
    // private static TIMEOUT = 15000;

    static async submitDebt(debtData: IDebtDTO, user: IUserDetails) {

        try {
            const refinedUserData = {
                userId: user.userId,
                phoneNumber: user.phoneNumber,
                status: user.status,
                role: user.role,
                is2FA: user.is2FA || false,
            }

            const accessToken = await generateAccessToken(refinedUserData);

            await debtService.createDebt(accessToken, debtData);

            // Submit to main application
            // const response = await axios.post(
            //     `${this.BASE_URL}/api/transactions`,
            //     transactionData,
            //     {
            //         headers: {
            //             'Authorization': `Bearer ${accessToken}`,
            //             'Content-Type': 'application/json',
            //             'X-Source': 'account-aggregator-simulator',
            //             'X-User-Agent': 'AA-Simulator/1.0'
            //         },
            //         timeout: this.TIMEOUT
            //     }
            // );

            console.log(`Debt submitted successfully`);

        } catch (error) {
            console.error(`Failed to submit Debt`);
            throw error;
        }
    }
};