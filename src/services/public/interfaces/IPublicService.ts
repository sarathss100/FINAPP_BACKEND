import { IFaq } from '../../../dtos/base/FaqDto';

interface IPublicService {
    getFaqs(): Promise<IFaqDTO[]>;
}

export default IPublicService;
