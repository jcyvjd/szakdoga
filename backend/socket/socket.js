import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

import { sendMessage, getMessages } from '../controllers/messageController.js';

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


    socket.on("sendMessage", (data) => {sendMessage(socket, data)});
    socket.on("getMessages", (data) => {getMessages(socket, data)});


    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        console.log('user disconnected', socket.id);
    });
});


export {app, io, server}