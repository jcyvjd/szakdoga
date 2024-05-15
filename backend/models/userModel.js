import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null,
    },
    status:{
        type: String,
        enum: ['offline','online','ready','playing', 'waiting'],
        default: 'offline',
    },
})

const User = mongoose.model("User", userSchema)
export default User