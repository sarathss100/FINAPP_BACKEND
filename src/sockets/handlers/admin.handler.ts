import ChatService from "../../services/chats/ChatService";
import IChatService from "../../services/chats/interfaces/IChatService";
import { Socket, Server } from "socket.io";

const chatService: IChatService = ChatService.instance;

const registerAdminHandlers = (socket: Socket, io: Server): void => {
  const adminId = socket.data.userId;

  try {
    if (!socket.rooms.has('admin')) {
      socket.join('admin');
      console.log(`Admin ${adminId} connected`);
    }
    
    // Send all chat history to admin on connection
    const sendChatHistoryToAdmin = async (userId?: string) => {
      try {
        const history = userId
          ? await chatService.getChatHistory(userId)
          : await chatService.getAllChatSessions();

        const event = userId ? 'user_chat_history' : 'get_all_chats';
        socket.emit(event, userId ? { userId, history } : history);
      } catch (error) {
        console.error(`Failed to load chat history:`, error);
        socket.emit('error', 'Failed to load chat history');
      }
    };

    const initializeAdminData = async () => {
      await sendChatHistoryToAdmin();
    };

    initializeAdminData().catch(err => {
      console.error('Error initializing admin data:', err);
    });

    socket.on("join_user_room", async ({ userId }) => {
      const room = `chat_${userId}`;
      socket.join(room);
      console.log(`Admin joined user room: ${userId}`);

      const chatNamespace = io.of('/chat');
      const roomSet = chatNamespace.adapter.rooms.get(room) || new Set();
      roomSet.add(socket.id);
      chatNamespace.adapter.rooms.set(room, roomSet);

      await sendChatHistoryToAdmin(userId);
    });

    socket.on("admin_message", async ({ message, userId }) => {
      if (!message || !userId) {
        socket.emit('error', 'Missing message or user ID');
        return;
      }

      const room = `user_${userId}`;
      const msg = {
        id: Date.now().toString(),
        message,
        sender: "admin",
      };

      try {
        await chatService.createChat(userId, 'admin', message);
        
        // Send admin message to the specific user
        io.of('/chat').to(room).emit("admin_message", msg);
        
        // Also notify admin about successful message send
        socket.emit("message_sent", { userId, message });
      } catch (error) {
        console.error(`Failed to send message to user ${userId}:`, error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Handle typing indicators for admin
    socket.on("admin_typing", ({ userId }) => {
      if (userId) {
        io.to(`chat_${userId}`).emit("admin_typing");
      }
    });

    socket.on("admin_stop_typing", ({ userId }) => {
      if (userId) {
        io.to(`chat_${userId}`).emit("admin_stop_typing");
      }
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