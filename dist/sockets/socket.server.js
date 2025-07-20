"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const namespaces_1 = require("./namespaces");
let io;
const setupSocketIO = function (server) {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true
        },
        path: '/socket.io',
    });
    (0, namespaces_1.setupNamespaces)(io);
    console.log(`Socket.IO initialized`);
};
exports.setupSocketIO = setupSocketIO;
