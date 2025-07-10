import { Socket, Server } from "socket.io";
import { decodeAndValidateToken } from "utils/auth/tokenUtils";
import mongoose from "mongoose";
import ChatService from "services/chats/ChatService";

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

const chatService = ChatService.instance;

const registerChatHandlers = (socket: Socket, io: Server): void => {
  const { accessToken } = socket.handshake.auth || {};
  if (!accessToken) {
    socket.emit("auth_error", "Missing access token");
    socket.disconnect();
    return;
  }

  try {
    const userId = decodeAndValidateToken(accessToken);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      socket.emit("auth_error", "Invalid user ID in token");
      socket.disconnect();
      return;
    }

    socket.userId = userId;
    const roomName = `chat_${userId}`;
    socket.join(roomName);
    console.log(`User ${userId} connected to room ${roomName}`);

    // Notify admins
    io.to("admin").emit("user_connected", { userId });

    // Send chat history to user
    chatService.getChatHistory(userId).then(history => {
        socket.emit('chat_history', history);
    });

    socket.on("user_message", async (payload) => {
      const message = {
        id: payload.id,
        message: payload.message,
        sender: "user",
        userId,
      };

      await chatService.createChat(userId, 'user', message.message);

      io.to("admin").emit("user_message", message); // To admin
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  } catch (err) {
    console.error("User socket error:", err);
    socket.emit("auth_error", "Authentication failed");
    socket.disconnect();
  }
};

export default registerChatHandlers;