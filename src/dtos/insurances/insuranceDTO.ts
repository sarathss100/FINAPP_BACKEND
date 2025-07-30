export default interface InsuranceDTO {
    _id?: string;
    userId?: string;
    type: string;
    coverage: number;
    premium: number;
    next_payment_date: Date;
    payment_status: string;
    status?: string;
}