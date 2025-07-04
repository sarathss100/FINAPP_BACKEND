/**
 * DTO for Reset Password request
 */
export interface ResetPasswordDto {
    phone_number: string; // Must be exactly 10 digits
    password: string;     // Must be at least 8 characters long
}