/**
 * DTO for Signin request
 */
export interface SigninDto {
    phone_number: string; // Must be exactly 10 digits
    password: string;     // Must be at least 8 characters long
}