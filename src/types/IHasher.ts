interface IHasher {
    hash(password: string): Promise<string>
}

export default IHasher;
