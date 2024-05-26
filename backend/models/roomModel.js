import mongoose, { mongo } from "mongoose";
//import Chat from "./chatModel.js"
//import User from "./userModel.js"


const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    users:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    //game session
    gameId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        default: null
    },
    hasPassword:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        default: null
    }
},{ timestamps: true })


const Room = mongoose.model('Room', roomSchema)

export default Room