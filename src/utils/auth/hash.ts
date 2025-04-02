import bcrypt from 'bcrypt';
import IHasher from 'types/utils/IHasher';

/**
 * BcryptHasher is an implementation of the IHasher interface.
 * It provides methods to hash passwords securely and verify plain-text passwords against hashed passwords.
 * This class uses the bcrypt library for hashing and verification, ensuring strong password security.
 */
class BcryptHasher implements IHasher {
    /**
     * Hashes a plain-text password using bcrypt.
     * 
     * @param password - The plain-text password to be hashed.
     * @returns A Promise that resolves to the hashed password as a string.
     * 
     * The method uses bcrypt's `hash` function with a salt round of 10.
     * Salt rounds determine the computational cost of hashing; higher values are more secure but slower.
     */
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    /**
     * Verifies a plain-text password against a hashed password.
     * 
     * @param password - The plain-text password provided by the user.
     * @param hashedPassword - The hashed password stored in the database.
     * @returns A Promise that resolves to a boolean indicating whether the passwords match.
     * 
     * The method uses bcrypt's `compare` function to securely compare the plain-text password
     * with the hashed password. This ensures that even if the hashed password is compromised,
     * the original password remains secure.
     */
    async verify(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default BcryptHasher;
