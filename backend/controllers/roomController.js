import Room from "../models/roomModel.js"
import User from "../models/userModel.js"
import mongoose from "mongoose"
import { io } from "../socket/socket.js"
import Game from "../models/game/gameModel.js"
import { leaveCurrentGame, deleteGame } from "./gameController.js"

export const getRooms = async (req, res) => {
    try {
        const allRooms = await Room.find().populate("users").sort({ createdAt: -1 });

        res.status(200).json(allRooms)

        io.emit("getRooms", allRooms)

    } catch (error) {
        console.log("Error in getRooms: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getRoom = async (req,res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'No such room'})
        }

        const room = await Room.findById(id).populate("users")

        if (!room) {
            return res.status(404).json({error: 'No such room'})
        }

        res.status(200).json(room)

    } catch (error) {
        console.log("Error in getRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const createRoom = async (req, res) => {
    try {
        const {name} =  req.body
        if(!name){
            return res.status(400).json({error:"No room name"})
        }
        const room = await Room.create({
            name,
            owner: req.user._id,
            chat: null,
            users: [],
            gameId: null
        })
        room.populate("users");
        //SOCKET IO
        io.emit("newRoom", room);

        res.status(200).json(room)
    } catch (error) {
        console.log("Error in createRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const joinRoom = async (req,res) => {
    try {
        const loggedInUserId = req.user._id
        const roomId = req.params.id

//elozobol ki kell venni ha benne van
        await Room.findOneAndUpdate(
            {_id: req.user.roomId},
            { $pull: { users: loggedInUserId }}, 
            { new: true }
        )
        
        const roomba = await Room.findById(roomId)
        if(!roomba){
            return res.status(400).json({error:"No room found with such id"})
        }
        if(roomba.gameId){
            return res.status(400).json({error:"Cannot join room while in game session"})
        }
        if(roomba.users.length >= 4){
            return res.status(400).json({error:"Room is full"})
        }

        await User.findOneAndUpdate(
            { _id: loggedInUserId },
            { roomId: roomId, status: 'waiting' }, 
            { new: true }
        )

        const room = await Room.findOneAndUpdate(
            { _id: roomId },
            { $addToSet: { users: loggedInUserId } }, // $addToSet adds to array if not already present
            { new: true } // to return the updated room document
        ).populate("users")
        if(!room){
            return res.status(400).json({error:"No room found with such id"})
        }
        //SOCKET IO
        io.emit("updateRoom", room)
        res.status(200).json(room)

    } catch (error) {
        console.log("Error in joinRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const leaveRoom = async (req,res) => {
    try {
        console.log("leaving room")
        const loggedInUserId = req.user._id
        const roomId = req.params.id

        const usr = await User.findOneAndUpdate(
            { _id: loggedInUserId },
            { roomId: null, status: 'online' }, 
            { new: true }
        )
        if(!usr){
            return res.status(400).json({error:"No user found with such id"})
        }

        const room = await Room.findOneAndUpdate(
            { _id: roomId },
            { $pull: { users: loggedInUserId }}, 
            { new: true } // to return the updated room document
        )

        if(!room){
            return res.status(400).json({error:"No room found with such id"})
        }
        if(room.gameId){
            await leaveCurrentGame(loggedInUserId);
        }
        room.populate("users");

        if(room.users.length === 0){
            await Room.findByIdAndDelete(roomId);
            io.emit("deleteRoom", room);
            await deleteGame(room.gameId);
        }
        //SOCKET IO
        io.emit("updateRoom", room)

        res.status(200).json(room)
        //console.log("leaveRoom: ", room)
    } catch (error) {
        console.log("Error in leaveRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

const clearUsers = async (roomId) => {
    await User.updateMany(
        { roomId: roomId },
        { roomId: null, status: 'online'}
    )
}

export const deleteRoom = async (req,res) => {
    try {
        const roomId = req.params.id
        const room = await Room.findById(roomId).populate("users")
        if(!room){
            return res.status(400).json({error:"No room found with such id"})
        }

        if(room.gameId){
            Game.findByIdAndDelete(room.gameId)
        }
        await clearUsers(roomId)

        if(!room.owner.equals(req.user._id)){
            return res.status(403).json({error:"You are not the owner of this room"})
        }else{
            await Room.findByIdAndDelete(roomId)
        }

        //SOCKET IO
        io.emit("deleteRoom", room)

        res.status(200).json(room)
    }catch (error) {
        console.log("Error in deleteRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}