import { IFaqDTO } from "../../../dtos/base/IFaqDTO";


export default interface IPublicService {
    getFaqs(): Promise<IFaqDTO[]>;
}

