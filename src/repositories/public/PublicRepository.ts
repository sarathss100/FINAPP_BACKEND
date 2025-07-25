import IPublicRepository from './interfaces/IPublicRepository';
import { FaqModel } from '../../model/admin/model/FaqModel';
import { IFaqDTO } from '../../dtos/base/FaqDto';

class PublicRepository implements IPublicRepository {

    // Fetches All published and non-deleted FAQ entries from the database
    async getFaqs(): Promise<IFaqDTO[] | null> {
        const result = await FaqModel.find({ isPublished: true, isDeleted: false });

        if (result.length) {
            const mappedData: IFaqDTO[] = result.map((data) => ({
                question: data.question,
                answer: data.answer,
                isDeleted: data.isDeleted,
                isPublished: data.isPublished,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }));

            return mappedData;
        } else {
            return null;
        }
    }
}

export default PublicRepository;
