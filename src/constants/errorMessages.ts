// src/constants/errorMessages.ts
export const ErrorMessages = {
    // General Errors
    INTERNAL_SERVER_ERROR: 'An unexpected server error occurred. Please try again later.',

    // Authentication Errors
    USER_ALREADY_EXISTS: 'A user with this phone number already exists.',
    USER_NOT_FOUND: 'The user does not exist.',
    INVALID_CREDENTIALS: 'Invalid phone number or password.',
    PASSWORD_MATCH_ERROR: 'The entered password is the same as your current password. Please enter a new password.',
    TOKEN_VERIFICATION_FAILED: 'Access token verification failed. Please log in again.',
    REFRESH_TOKEN_STORAGE_ERROR: 'An error occurred while storing the refresh token.',
    REFRESH_TOKEN_REMOVAL_ERROR: 'An error occurred while removing the refresh token.',
    PHONE_NUMBER_MISSING: 'Phone number is missing.',
    PHONE_NUMBER_NOT_FOUND: 'This phone number does not exist.',
    STATUS_CHECK_FAILED: 'Failed to verify the user status.',
    AUTH_COOKIE_MISSING: 'Authorization cookie is missing. Please log in again',
    ACCESS_TOKEN_NOT_FOUND: 'Access token not found on the request',
    SIGNOUT_ERROR: 'An error occured while signing out.',
    PASSWORD_RESET_FAILED: 'Failed to reset the password',
    FORBIDDEN_INSUFFICIENT_PERMISSIONS: 'Forbidden: You do not have sufficient permissions to perform this action.',
    USER_ID_MISSING_IN_TOKEN: 'User ID is missing in the decoded data. Ensure the token payload includes a valid "userId" field.',

    // User Profile Errors 
    FETCH_USER_PROFILE_FAILED: 'An unexpected error occured while trying to fetch user profile details. Please try again later or contact support if the issue persists.',

    // User Management Errors 
    STATUS_UPDATE_FAILED: 'Failed to update user status. Please try agian later or contact support.',
    NO_USERS_FOUND: 'No users found. Please ensure users exist in the system.',

    // Validation Errors
    VALIDATION_ERROR: 'Validation failed. Please check your input and try again.',
    INVALID_PHONE_NUMBER_OR_PASSWORD: 'Please enter a valid phone number or password.',
    TOKEN_GENERATION_ERROR: 'An error occurred while generating authentication tokens.',
    INVALID_INPUT: 'Invalid input. Please provide valid data.',
} as const;
