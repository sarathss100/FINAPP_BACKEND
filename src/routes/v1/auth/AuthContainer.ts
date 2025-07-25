import AuthService from '../../../services/auth/AuthService';
import AuthController from '../../../controller/auth/AuthController';
import IAuthController from '../../../controller/auth/ineterfaces/IAuthController';
import BcryptHasher from '../../../utils/auth/hash';
import AuthRepository from '../../../repositories/auth/AuthRepository';
import createAuthRouter from './AuthRouter';

const hasher = new BcryptHasher();

class AuthContainer {
    public readonly controller: IAuthController;
    public readonly router: ReturnType<typeof createAuthRouter>;

    constructor() {
        const repository = new AuthRepository();
        const service = new AuthService(repository, hasher);
        this.controller = new AuthController(service);
        this.router = createAuthRouter(this.controller);
    }
}

export default AuthContainer; 