export interface IFaqDTO {
    _id?: string;
    question: string;
    answer: string;
    isDeleted?: boolean;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
