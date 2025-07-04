import getBotResponse from "services/openAi/OpenAIService";

class ChatSocketService {
    async handleMessage(socket: import("socket.io").Socket, io: import("socket.io").Server, payload: { message: string; userId: string }): Promise<void> {
        const { message, userId } = payload;

        try {
            // Add a small delay before showing typing indicator to prevent flickering
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Emit bot_typing event to show typing indicator
            socket.emit('bot_typing');

            const botReply = await getBotResponse(message, userId);

            // Ensure typing indicator is shown for at least 500ms to prevent flickering
            await new Promise(resolve => setTimeout(resolve, 500));

            // Stop typing indicator
            socket.emit('bot_stop_typing');

            // Add a small delay before sending response to make transition smoother
            await new Promise(resolve => setTimeout(resolve, 200));

            // Send bot response with the structure expected by client
            socket.emit('bot_response', {
                message: botReply,
                id: Date.now().toString(), // Generate unique ID for the message
            });

        } catch (error) { 
            console.error('Error handling chat message:', error);
            
            // Stop typing indicator on error
            socket.emit('bot_stop_typing');
            
            // Small delay before error response
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Send error response in the same format as normal responses
            socket.emit('bot_response', {
                message: "I'm sorry, I'm having trouble processing your message. Please try again.",
                id: Date.now().toString(),
            });
        }
    }

    // Handle test connection event
    handleTestConnection(socket: import("socket.io").Socket): void {
        console.log('✅ Test connection received from:', socket.id);
        
        // Send confirmation back to client
        socket.emit('connection_confirmed', {
            socketId: socket.id,
            status: 'connected',
            timestamp: new Date().toISOString(),
        });
    }
}

export default ChatSocketService;