/**
 * DTO for FAQ
 */
export interface IFaq {
    question: string; // Must be at least 5 characters, max 255
    answer: string;   // Must be at least 10 characters, max 1000
    isDeleted?: boolean;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
