// import ChatService from "services/chats/ChatService";
// import { Socket, Server } from "socket.io";
// import { decodeAndValidateToken } from "utils/auth/tokenUtils";

// const chatService = ChatService.instance;

// const registerAdminHandlers = (socket: Socket, io: Server): void => {
//   const { accessToken } = socket.handshake.auth || {};

//   try {
//     const adminId = decodeAndValidateToken(accessToken);
//     socket.join("admin");
//     console.log(`Admin ${adminId} connected`);

//     socket.on("join_user_room", async ({ userId }) => {
//       const room = `chat_${userId}`;
//       socket.join(room);
//       console.log(`Admin joined user room: ${userId}`);

//       // Send chat history to admin for selected user 
//       const history = await chatService.getAllChatSessions();
//       socket.emit('get_all_chats', history);
//     });

//     socket.on("admin_message", async ({ message, userId }) => {
//       const room = `chat_${userId}`;
//       const msg = {
//         id: Date.now().toString(),
//         message,
//         sender: "admin",
//       };

//       await chatService.createChat(userId, 'admin', message);
      
//       io.to(room).emit("user_message", msg);
//     });

//     socket.on("disconnect", () => {
//       console.log(`Admin ${adminId} disconnected`);
//     });
//   } catch (err) {
//     console.error("Admin socket auth failed:", err);
//     socket.emit("auth_error", "Invalid or missing token");
//     socket.disconnect();
//   }
// };

// export default registerAdminHandlers;

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

    // Send all chat history to admin on connection
    const initializeAdminData = async () => {
      try {
        const history = await chatService.getAllChatSessions();
        socket.emit('get_all_chats', history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        socket.emit('error', 'Failed to load chat history');
      }
    };

    // Initialize data when admin connects
    initializeAdminData();

    socket.on("join_user_room", async ({ userId }) => {
      const room = `chat_${userId}`;
      socket.join(room);
      console.log(`Admin joined user room: ${userId}`);

      // Optionally send specific user's chat history when joining their room
      try {
        const userHistory = await chatService.getChatHistory(userId);
        socket.emit('user_chat_history', { userId, history: userHistory });
      } catch (error) {
        console.error(`Failed to load history for user ${userId}:`, error);
      }
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