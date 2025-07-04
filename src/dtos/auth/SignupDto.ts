/**
 * DTO for Signup request
 */
export interface SignupDto {
    first_name: string; // Must be at least 2 characters
    last_name: string;  // Must be at least 2 characters
    phone_number: string; // Must be exactly 10 digits
    password: string;     // Must be at least 8 characters long
}