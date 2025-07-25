import { IFaq } from '../../dtos/base/FaqDto';
import IPublicRepository from './interfaces/IPublicRepository';
import { FaqModel } from '../../model/admin/model/FaqModel';

class PublicRepository implements IPublicRepository {

    // Fetches All published and non-deleted FAQ entries from the database
    async getFaqs(): Promise<IFaq[] | null> {
        const result = await FaqModel.find({ isPublished: true, isDeleted: false });
        return result;
    }
}

export default PublicRepository;
