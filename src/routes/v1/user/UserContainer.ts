import UserRepository from 'repositories/user/UserRepository';
import UserService from 'services/user/UserService';
import UserController from 'controller/user/UserController';
import IUserController from 'controller/user/interfaces/IUserController';
import createUserRouter from './UserRouter';

class UserContainer {
    public readonly controller: IUserController;
    public readonly router: ReturnType<typeof createUserRouter>;

    constructor() {
        const repository = new UserRepository();
        const service = new UserService(repository);
        this.controller = new UserController(service);
        this.router = createUserRouter(this.controller);
    }
}

export default UserContainer;