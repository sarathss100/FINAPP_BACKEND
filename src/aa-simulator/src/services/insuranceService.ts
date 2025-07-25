import { generateAccessToken } from "../../../utils/auth/tokenUtils";
import IUserDetails from "../../../repositories/admin/interfaces/IUserDetails";
import IInsuranceService from "../../../services/insurances/interfaces/IInsuranceService";
import InsuranceService from "../../../services/insurances/InsuranceService";
import { InsuranceDTO } from "../../../dtos/insurances/insuranceDTO";

const insuranceService: IInsuranceService = InsuranceService.instance;

export class InsuranceGeneratorService {
    static async submitInsurance(insuranceData: InsuranceDTO, user: IUserDetails) {
        try {
            const refinedUserData = {
                userId: user.userId,
                phoneNumber: user.phoneNumber,
                status: user.status,
                role: user.role,
                is2FA: user.is2FA || false,
            };

            const accessToken = await generateAccessToken(refinedUserData);

            await insuranceService.createInsurance(accessToken, insuranceData);

            console.log(`Insurance submitted successfully`);
        } catch (error) {
            console.error(`Failed to submit Insurance`);
            throw error;
        }
    }
}