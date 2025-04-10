// src/constants/errorMessages.ts
export const ErrorMessages = {
    // General Errors
    INTERNAL_SERVER_ERROR: 'An unexpected server error occurred. Please try again later or contact support if the issue persists.',

    // Authentication Errors
    USER_ALREADY_EXISTS: 'A user with this phone number already exists. Please use a different phone number.',
    USER_NOT_FOUND: 'The user does not exist. Please check the provided phone number or sign up.',
    INVALID_CREDENTIALS: 'Invalid phone number or password. Please verify your credentials and try again.',
    PASSWORD_MATCH_ERROR: 'The entered password matches your current password. Please enter a new password.',
    TOKEN_VERIFICATION_FAILED: 'Access token verification failed. Please log in again to generate a new token.',
    REFRESH_TOKEN_STORAGE_ERROR: 'An error occurred while storing the refresh token. Please try again later.',
    REFRESH_TOKEN_REMOVAL_ERROR: 'An error occurred while removing the refresh token. Please try again later.',
    PHONE_NUMBER_MISSING: 'Phone number is missing. Please provide a valid phone number.',
    PHONE_NUMBER_NOT_FOUND: 'This phone number does not exist. Please check the phone number and try again.',
    STATUS_CHECK_FAILED: 'Failed to verify the user status. Please try again later or contact support.',
    AUTH_COOKIE_MISSING: 'Authorization cookie is missing. Please log in again to proceed.',
    ACCESS_TOKEN_NOT_FOUND: 'Access token not found on the request. Please ensure you are logged in.',
    SIGNOUT_ERROR: 'An error occurred while signing out. Please try again later.',
    PASSWORD_RESET_FAILED: 'Failed to reset the password. Please try again later or contact support.',
    FORBIDDEN_INSUFFICIENT_PERMISSIONS: 'Forbidden: You do not have sufficient permissions to perform this action.',
    USER_ID_MISSING_IN_TOKEN: 'User ID is missing in the decoded data. Ensure the token payload includes a valid "userId" field.',
    USER_IS_BLOCKED: 'Your account has been blocked. Please contact support for further assistance.',

    // User Profile Errors
    FETCH_USER_PROFILE_FAILED: 'An unexpected error occurred while fetching user profile details. Please try again later or contact support.',
    USER_PROFILE_PICTURE_MISSING_ERROR: 'The request is missing the image data required to upload the profile picture.',
    CLOUDINARY_IMAGE_UPLOAD_FAILED: 'Failed to upload the image to Cloudinary. Please try again later or contact support.',
    FAILED_TO_UPLOAD_PROFILE_PICTURE: 'Failed to upload the profile picture. Please try again later or contact support.',
    FAILED_TO_FETCH_PROFILE_PICTURE_URL: 'Failed to retrieve the profile picture URL. Please try again later or contact support.',
    FAILED_TO_UPDATE_THE_GOAL_AMOUNT: 'Failed to update the Goal Amount. Please try again later or contact support.',

    // User Management Errors
    STATUS_UPDATE_FAILED: 'Failed to update user status. Please try again later or contact support.',
    NO_USERS_FOUND: 'No users found. Please ensure users exist in the system.',

    // Validation Errors
    VALIDATION_ERROR: 'Validation failed. Please check your input and try again.',
    INVALID_PHONE_NUMBER_OR_PASSWORD: 'Please enter a valid phone number or password.',
    TOKEN_GENERATION_ERROR: 'An error occurred while generating authentication tokens. Please try again later.',
    INVALID_INPUT: 'Invalid input. Please provide valid data.',
} as const;
