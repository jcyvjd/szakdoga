import User from "../models/userModel.js"
import Room from "../models/roomModel.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { io } from "../socket/socket.js"

export const signup = async (req, res) => {
    try{
        const {username, password, confirmPassword} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({username})
        
        if(user){
            return res.status(400).json({error:"Username already exists"})
        }
        //HASH pw
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({username, password: hashedPassword})

        if(newUser){
            //Generate JWT token
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                password: newUser.password,
                roomId: null
            })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }

    }catch(error){
        console.log("Error in signup controller", error.message)
        res.status(400).json({error:"Internal Server Error"})
    }
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid credentials"})
        }
        user.status = "online";
        user.save()

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            username: user.username,
            roomId: user.roomId
        })

    }catch(error){
        console.log("Error in login controller", error.message)
        res.status(400).json({error:"Internal Server Error"})
    }
}

export const logout = async (req, res) => {
    try {
        const user = req.body.authUser
        const current = await User.findById(user._id)

        if(!current){
            return res.status(400).json({error:"User not found"})
        }

        await Room.findOneAndUpdate(
            {_id: current.roomId},
            { $pull: { users: user._id }}, 
            { new: true }
        )
        await User.findOneAndUpdate(
            { _id: user._id},
            { roomId : null, status: "offline"},
            { new: true}
        )
        

        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({messae:"Logged out succesfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(400).json({error:"Internal Server Error"})
    }
}

export const setReady = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(400).json({error:"User not found"})
        }

        user.status = user.status === "ready" ? "waiting" : "ready"
        await user.save()

        const room = await Room.findById(user.roomId).populate("users")
        if(!room){
            return res.status(400).json({error:"No room found with such id"})
        }else{
            io.emit("updateRoom", room)
        }

        res.status(200).json(user.status)
    }catch(error){
        console.log("Error in setReady controller", error.message)
        res.status(400).json({error:"Internal Server Error"})
    }
}