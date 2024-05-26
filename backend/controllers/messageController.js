import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import Room from '../models/roomModel.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import User from '../models/userModel.js';

// export const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: roomId } = req.params;
//         const senderId = req.user._id;
//         const username = req.user.username;

//         let chat = await Chat.findOne({
//             roomId: roomId,
//         });

//         if (!chat) {
//             chat = await Chat.create({
//                 roomId: roomId,

//             });
//         }

//         const newMessage = new Message({
//             senderName: username,
//             senderId: senderId,
//             recieverId: roomId,
//             message: message,
//         });

//         if(newMessage){
//             chat.messages.push(newMessage._id);
//         }
//         await Promise.all([newMessage.save(), chat.save()]);

//         //socket
//         const room = await Room.findOne({ _id: roomId });

//         room.users.forEach((user) => {
//             const receiverSocketId = getReceiverSocketId(user);
//             if (receiverSocketId) {
//                 console.log("receiverSocketId", receiverSocketId);
//                 io.to(receiverSocketId).emit("newMessage", newMessage);
//             }
//         }); 


//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log("Error in sendMessage controller", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

export const sendMessage = async ( io, data) => {
    try {
        const userId = io.handshake.query.userId;
        const { receiverId, message } = data;
        console.log("message data: ", data)

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

// export const sendMessage = async(req,res) =>{
//     try {
//         const {message} = req.body
//         const {id:receiverId} = req.params
//         const senderId = req.user._id

//         let chat = await Chat.findOne({
//             participants: { $all:[senderId,receiverId]},
//         })

//         if(!chat){
//             chat = await Chat.create({
//                 participants: [senderId, receiverId],
//             })
//         }

//         const newMessage = new Message({
//             senderId: senderId,
//             reciverId: receiverId,
//             message: message
//         })

//         if(newMessage){
//             chat.messages.push(newMessage._id)
//         }

//         //socketio ide


//         //await chat.save()
//         //await newMessage.save()
//         await Promise.all([chat.save(), newMessage.save()])

//         res.status(201).json(newMessage)

//     } catch (error) {
//         console.log("Error in sendMessage controller", error.message)
//         res.status(500).json({error:"Internal server error"})
//     }
// }