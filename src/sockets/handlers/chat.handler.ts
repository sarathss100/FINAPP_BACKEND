import { Socket, Server } from "socket.io";
import ChatService from "services/chats/ChatService";
import IChatService from "services/chats/interfaces/IChatService";
// import getBotResponse from "services/openAi/OpenAIService";
import { notifyAdminOfUserConnection } from "sockets/utils/socketRoomUtils";

interface ChatMessagePayload {
  id: string;
  message: string;
  userId?: string; 
}

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

const chatService: IChatService = ChatService.instance;

// Utility to delay execution
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if admin is present in the user's chat room
// const isAdminInUserRoom = (io: Server, userId: string): boolean => {
//   const room = `chat_${userId}`;
//   const roomSockets = io.sockets.adapter.rooms.get(room);

//   if (!roomSockets || roomSockets.size === 0) {
//     console.log(`No sockets in room ${room}`);
//     return false;
//   }

//   // Loop through each socket ID in the room
//   for (const socketId of roomSockets) {
//     const socket = io.sockets.sockets.get(socketId);

//     if (!socket) continue;

//     // Check if the socket belongs to an admin
//     if (socket.data?.role === 'admin' || socket.rooms.has('admin')) {
//       console.log(`Admin found in room ${room}`);
//       return true;
//     }
//   }

//   console.log(`No admin found in room ${room}`);
//   return false;
// };

// Bot response handler with typing indicator
// const handleBotResponse = async (socket: Socket, io: Server, payload: { message: string; userId: string }) => {
//   const { message, userId } = payload;

//   try {
//     // Check if admin is present in the user's chat room
//     if (isAdminInUserRoom(io, userId)) {
//       console.log(`Admin is present in chat_${userId}, bot will remain silent`);
//       return; // Bot stays silent when admin is present
//     }

//     await delay(300); // Prevent flicker
//     socket.emit('bot_typing');

//     const botReply = await getBotResponse(message, userId);

//     await delay(500); // Minimum typing duration
//     socket.emit('bot_stop_typing');
//     await delay(200); // Smooth transition

//     const botMessage = {
//       message: botReply,
//       id: Date.now().toString(),
//     };

//     // Send bot response to user
//     socket.emit('bot_response', botMessage);
//     await chatService.createChat(userId, 'admin', botReply);

//   } catch (error) {
//     console.error('Error handling chat message:', error);
//     socket.emit('bot_stop_typing');
//     await delay(200);
//     socket.emit('bot_response', {
//       message: "I'm sorry, I'm having trouble processing your message. Please try again.",
//       id: Date.now().toString(),
//     });
//   }
// };

const registerChatHandlers = (socket: Socket, io: Server): void => {
  const userId = socket.data.userId;

  try {
    if (!socket.rooms.has(`chat_${userId}`)) {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`Chat Socket ${socket.id} joined room: ${roomName}`);
      notifyAdminOfUserConnection(io, userId);
    }

    // Send chat history on connection 
    chatService.getChatHistory(userId).then(history => {
      socket.emit('chat_history', history);
    }).catch((error) => {
      console.error(`Failed to load chat history for user ${userId}:`, error);
    });

    const handleTestConnection = () => {
      console.log('Test connection received from:', socket.id);
      socket.emit('connection_confirmed', {
        socketId: socket.id,
        userId: userId, // Include userId in response
        status: 'connected',
        timestamp: new Date().toISOString(),
      });
    };

    const handleUserMessage = async (payload: ChatMessagePayload) => {
      // Use userId from socket.data if not provided in payload
      const actualUserId = userId || payload.userId;
      
      const message = {
        id: payload.id,
        message: payload.message,
        sender: "user",
        userId: actualUserId,
      };

      try {
        await chatService.createChat(actualUserId, 'user', message.message);

        // handleBotResponse(socket, io, { message: payload.message, userId: actualUserId });

        // Emit to admin room with correct event name
        io.of('/admin').to('admin').emit("user_message", message);
      } catch (error) {
        console.error(`Failed to process message from user ${actualUserId}:`, error);
        socket.emit("error", "Failed to send message");
      }
    };

    const handleDisconnect = () => {
      console.log(`User ${userId} disconnected`);
      socket.off("test_connection", handleTestConnection);
      socket.off("user_message", handleUserMessage);
    };

    socket.on('test_connection', handleTestConnection);
    socket.on('user_message', handleUserMessage);

    socket.on("disconnect", handleDisconnect);
  } catch (err) {
    console.error("User socket error:", err);
    socket.emit("auth_error", "Authentication failed");
    socket.disconnect();
  }
};

export default registerChatHandlers;