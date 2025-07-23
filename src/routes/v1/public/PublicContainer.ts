import PublicRepository from 'repositories/public/PublicRepository';
import PublicService from 'services/public/PublicService';
import IPublicController from 'controller/public/interfaces/IPublicController';
import PublicController from 'controller/public/publicController';
import createPublicRouter from './PublicRouter';

class PublicContainer {
    public readonly controller: IPublicController;
    public readonly router: ReturnType<typeof createPublicRouter>;

    constructor() {
        const repository = new PublicRepository();
        const service = new PublicService(repository);
        this.controller = new PublicController(service);
        this.router = createPublicRouter(this.controller);
    }
}

export default PublicContainer;