/**
 * A collection of success messages used throughout the application.
 * These messages are grouped by category for better organization and consistency.
 */
export const SuccessMessages = {
    // Authentication Success Messages
    SIGNUP_SUCCESS: 'User account created successfully.',
    SIGNIN_SUCCESS: 'Sign-in completed successfully.',
    SIGNOUT_SUCCESS: 'Signed out successfully.',
    TOKEN_VERIFIED: 'Access token verified successfully.',
    PHONE_NUMBER_VERIFIED: 'Phone number verified successfully.',
    PASSWORD_RESET_SUCCESS: 'Password updated successfully.',

    // General Success Messages
    OPERATION_SUCCESS: 'Operation completed successfully.',

    // User Success Messages
    USER_PROFILE_FETCHED: 'User profile details retrieved successfully.',
    USER_PROFILE_PICTURE_URL_FETCHED: 'User profile picture URL retrieved successfully.',
    USER_STATUS_UPDATED: 'User status updated successfully.',
    USER_PROFILE_PICTURE_UPLOADED: 'Profile picture uploaded successfully.',
    USER_GOAL_UPDATED: 'User goal updated successfully.',
    SUCCESSFULLY_TOGGLED_2FA: 'Two-Factor Authentication (2FA) status updated successfully.',
    USER_ACCOUNT_DELETED: 'User account deleted successfully.',

    // Goal Success Messages
    GOAL_CREATED: 'User goal created successfully.',
    GOAL_REMOVED: 'Goal removed successfully.',
    GOALS_RETRIEVED: 'User goals retrieved successfully.',
    GOALS_LONGEST_TIME_REMAINING: 'Goal with the longest time remaining retrieved successfully.',

    // Admin Success Messages
    FAQ_ADDED: 'FAQ added successfully.',
    FAQ_FETCHED_SUCCESSFULLY: 'FAQs retrieved successfully.',
} as const;
