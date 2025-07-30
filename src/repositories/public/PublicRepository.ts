import IPublicRepository from './interfaces/IPublicRepository';
import { FaqModel } from '../../model/admin/model/FaqModel';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import IFaqDocument from '../../model/admin/interfaces/IFaq';
import BaseRepository from '../base_repo/BaseRepository';

export default class PublicRepository implements IPublicRepository {
    public baseRepo: IBaseRepository<IFaqDocument> = new BaseRepository<IFaqDocument>(FaqModel);

    async getFaqs(): Promise<IFaqDocument[]> {
        try {
            const result = await this.baseRepo.find({ isPublished: true, isDeleted: false });

            return result;
        } catch (error) {
            throw new Error(`${(error as Error).message}`);
        }
    }
}