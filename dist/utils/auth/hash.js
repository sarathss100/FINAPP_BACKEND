"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * BcryptHasher is an implementation of the IHasher interface.
 * It provides methods to hash passwords securely and verify plain-text passwords against hashed passwords.
 * This class uses the bcrypt library for hashing and verification, ensuring strong password security.
 */
class BcryptHasher {
    /**
     * Hashes a plain-text password using bcrypt.
     *
     * @param password - The plain-text password to be hashed.
     * @returns A Promise that resolves to the hashed password as a string.
     *
     * The method uses bcrypt's `hash` function with a salt round of 10.
     * Salt rounds determine the computational cost of hashing; higher values are more secure but slower.
     */
    hash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 10);
        });
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
    verify(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hashedPassword);
        });
    }
}
exports.default = BcryptHasher;
