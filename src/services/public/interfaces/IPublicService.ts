import { IFaq } from '../../../dtos/base/FaqDto';

interface IPublicService {
    getFaqs(): Promise<IFaq[]>;
}

export default IPublicService;
