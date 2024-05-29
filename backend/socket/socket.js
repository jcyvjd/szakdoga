import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

import { messageHandler } from './socketHandlers/messageHandler.js';
import { gameHandler } from './socketHandlers/gameHandler.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    }
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
	console.log("a user connected", socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
    }

    messageHandler(socket);
    gameHandler(socket);

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        console.log('user disconnected', socket.id);
    });
});


export {app, io, server};
