import mongoose from "mongoose";
//import User from "./userModel.js";
//import Message from "./messageModel.js";

const chatSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    messages:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default:[]
        }
    ]
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat