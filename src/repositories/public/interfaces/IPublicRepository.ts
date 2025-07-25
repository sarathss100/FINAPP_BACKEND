import { IFaqDTO } from "../../../dtos/base/FaqDto";

interface IPublicRepository {
    getFaqs(): Promise<IFaqDTO[] | null>
}


export default IPublicRepository;
