import { initiatePaymentDTO } from "../../../dtos/subscriptions/subscriptionDTO";

export default interface ISubscriptionService {
    initiatePayment(accessToken: string, formData: initiatePaymentDTO): Promise<string>;
}

