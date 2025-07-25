import { IFaqDTO } from "../../../dtos/base/FaqDto";

interface IPublicService {
    getFaqs(): Promise<IFaqDTO[]>;
}

export default IPublicService;
