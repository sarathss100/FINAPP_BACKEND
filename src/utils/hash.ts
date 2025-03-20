import bcrypt from 'bcrypt';
import IHasher from 'types/IHasher';

class BcryptHasher implements IHasher {
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}

export default BcryptHasher;
