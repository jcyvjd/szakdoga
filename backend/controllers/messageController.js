import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import Room from '../models/roomModel.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import User from '../models/userModel.js';

export const sendMessage = async ( io, data) => {
    try {
        const userId = io.handshake.query.userId;
        const { receiverId, message } = data;

        const user = await User.findOne({ _id: userId });
        if(!user){
            return console.log("User not found, id: ", userId);
        }

        let chat = await Chat.findOne({
            roomId: receiverId,
        });

        if (!chat) {
            chat = await Chat.create({
                roomId: receiverId,
            });
        }

        const newMessage = new Message({
            senderName: user.username,
            senderId: userId,
            receiverId: receiverId,
            message: message,
        });

        if(newMessage){
            chat.messages.push(newMessage._id);
        }
        await Promise.all([newMessage.save(), chat.save()]);

        const room = await Room.findOne({ _id: receiverId });
        if(!room){
            return console.log("Room not found");
        }

        room.users.forEach((user) => {
            const receiverSocketId = getReceiverSocketId(user);
            if (receiverSocketId) {
                console.log("receiverSocketId", receiverSocketId);
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        }); 
        
        io.emit("newMessage", newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
    }
}

export const getMessages = async (io, data) => {
    try {
        const { roomId } = data;

        let chat = await Chat.findOne({ roomId }).populate("messages");

        if (!chat) { 
            console.log("Chat not found, roomId: ", roomId);
            chat = await Chat.create({
                roomId: roomId,
            });
            await chat.save();
        }
        
        if(chat){
            const messages = chat.messages || [];
            io.emit("getMessages", messages);
        }

    } catch (error) {
        console.error("Error in getMessages controller", error.message);
    }
}
