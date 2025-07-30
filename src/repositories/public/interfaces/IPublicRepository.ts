import IFaqDocument from "../../../model/admin/interfaces/IFaq";

export default interface IPublicRepository {
    getFaqs(): Promise<IFaqDocument[]>
}
