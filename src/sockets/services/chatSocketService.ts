import getBotResponse from "services/openAi/OpenAIService";

class ChatSocketService {
    async handleMessage(socket: import("socket.io").Socket, io: import("socket.io").Server, payload: { message: string }, userId: string): Promise<void> {
        const { message } = payload;

        try {
            const botReply = await getBotResponse(message, userId);

            io.to(userId).emit('bot_reply', {
                role: 'bot',
                message: botReply,
            });

        } catch (error) {
            console.error('Error handling chat message:', error);
            socket.emit('error', 'Failed to process message');
        }
    }
}

export default ChatSocketService;