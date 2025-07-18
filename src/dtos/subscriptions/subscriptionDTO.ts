
export interface SubscriptionDTO {
    _id?: string;
    user_id: string;
    plan_name: string;
    plan_type: 'monthly' | 'annually';
    payment_date: Date;
    expiry_date: Date;
    amount: number;
    currency: 'INR';
    subscription_mode: 'auto_renewal' | 'manual';
    status: "active" | "expired" | 'cancelled';
    payment_method: string;
    transaction_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface initiatePaymentDTO {
    plan: 'monthly' | 'annually';
    amount: number;
    currency: 'INR';
}