"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAdminOfUserConnection = exports.joinUserRoom = void 0;
const joinUserRoom = function (socket, userId) {
    const roomName = `user_${userId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
};
exports.joinUserRoom = joinUserRoom;
const notifyAdminOfUserConnection = function (io, userId) {
    io.of('/admin').emit('user_connected', { userId });
};
exports.notifyAdminOfUserConnection = notifyAdminOfUserConnection;
