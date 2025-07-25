import { initiatePaymentDTO } from "../../../dtos/subscriptions/subscriptionDTO";

interface ISubscriptionService {
    initiatePayment(accessToken: string, formData: initiatePaymentDTO): Promise<string>;
}

export default ISubscriptionService;

