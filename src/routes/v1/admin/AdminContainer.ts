import AdminController from '../../../controller/admin/AdminController';
import IAdminController from '../../../controller/admin/interfaces/IAdminController';
import AdminRepository from '../../../repositories/admin/AdminRepository';
import AdminService from '../../../services/admin/AdminService';
import createAdminRouter from './AdminRouter';

class AdminContainer {
    public readonly controller: IAdminController;
    public readonly router: ReturnType<typeof createAdminRouter>;

    constructor() {
        const repository = new AdminRepository();
        const service = new AdminService(repository);
        this.controller = new AdminController(service);
        this.router = createAdminRouter(this.controller);
    }
}

export default AdminContainer;
