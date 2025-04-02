/**
 * Represents a success response
 */
export interface SuccessResponse<T = Record<string, unknown>> {
    success: true;
    message: string;
    data: T | null;
}

/**
 * Represents a error response
 */
export interface ErrorResponse {
    success: false;
    message: string;
    details: Array<string> | string | null;
}
