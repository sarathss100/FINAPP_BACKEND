/**
 * DTO for Chat message
 */
export interface ChatDTO {
    _id?: string;
    userId?: string;     // User ID is required (if present)
    role: 'user' | 'bot'; // Role must be either 'user' or 'bot'
    message: string;     // Message content is required
    timestamp?: Date;    // Must be a valid ISO date string
}