import ChatService from "services/chats/ChatService";
import { Socket, Server } from "socket.io";
import { decodeAndValidateToken } from "utils/auth/tokenUtils";

const chatService = ChatService.instance;

const registerAdminHandlers = (socket: Socket, io: Server): void => {
  const { accessToken } = socket.handshake.auth || {};

  try {
    const adminId = decodeAndValidateToken(accessToken);
    socket.join("admin");
    console.log(`Admin ${adminId} connected`);

    socket.on("join_user_room", async ({ userId }) => {
      const room = `chat_${userId}`;
      socket.join(room);
      console.log(`Admin joined user room: ${userId}`);

      // Send chat history to admin for selected user 
      const history = await chatService.getChatHistory(userId);
      socket.emit('chat_history', history);
    });

    socket.on("admin_message", async ({ message, userId }) => {
      const room = `chat_${userId}`;
      const msg = {
        id: Date.now().toString(),
        message,
        sender: "admin",
      };

      await chatService.createChat(userId, 'admin', message);
      
      io.to(room).emit("user_message", msg);
    });

    socket.on("disconnect", () => {
      console.log(`Admin ${adminId} disconnected`);
    });
  } catch (err) {
    console.error("Admin socket auth failed:", err);
    socket.emit("auth_error", "Invalid or missing token");
    socket.disconnect();
  }
};

export default registerAdminHandlers;