import { Socket, Server } from "socket.io";

export const joinUserRoom = function(socket: Socket, userId: string): void {
    const roomName = `user_${userId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
};

export const notifyAdminOfUserConnection = function(io: Server, userId: string): void {
    io.of('/admin').emit('user_connected', { userId });
};
