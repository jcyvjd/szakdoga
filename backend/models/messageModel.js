import mongoose  from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName:{
        type: String,
        required: true
    },
    senderId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    recieverId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true
    },
    message:{
        type: String,
        required: true
    }
},{timestamps: true})

const Message = mongoose.model("Message", messageSchema)

export default Message