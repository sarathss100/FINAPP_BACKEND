/**
 * DTO for Insurance entity
 */
export interface InsuranceDTO {
    _id?: string;
    userId?: string;
    type: string; // Must not be empty
    coverage: number; // Must be positive
    premium: number; // Must be positive
    next_payment_date: Date; // Must be a valid date
    payment_status: string; // Must not be empty
    status?: string; // Optional, but must not be empty if provided
}