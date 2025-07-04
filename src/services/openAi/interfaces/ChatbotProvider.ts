
interface ChatbotProvider {
    getBotResponse(userMessage: string): Promise<string>;
}

export default ChatbotProvider;