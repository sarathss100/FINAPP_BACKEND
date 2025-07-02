
interface IChatRepository {
    createChat(): Promise<void>;
}

export default IChatRepository;