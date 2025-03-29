interface IHasher {
    hash(password: string): Promise<string>
    verify(password: string, hashedPassword: string): Promise<boolean>;
}

export default IHasher;
