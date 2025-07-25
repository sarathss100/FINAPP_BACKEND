import { IFaq } from '../../../dtos/base/FaqDto';

interface IPublicRepository {
    getFaqs(): Promise<IFaq[] | null>
}


export default IPublicRepository;
