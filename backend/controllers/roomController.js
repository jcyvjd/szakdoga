import Room from "../models/roomModel.js"
import User from "../models/userModel.js"
import mongoose from "mongoose"
import { io } from "../socket/socket.js"
import Game from "../models/game/gameModel.js"
import { leaveCurrentGame, deleteGame } from "./gameController.js"
import bcrypt from "bcryptjs"

export const getRooms = async (req, res) => {
    try {
        const allRooms = await Room.find().populate({ path: "users", select: '-password' }).sort({ createdAt: -1 });

        const sanitizedRooms = allRooms.map(room => ({
            _id: room._id,
            name: room.name,
            owner: room.owner,
            chat: room.chat,
            users: room.users,
            gameId: room.gameId,
            hasPassword: room.hasPassword // Only send hasPassword to the frontend
        }));

        res.status(200).json(sanitizedRooms)

        io.emit("getRooms", sanitizedRooms)

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

        const room = await Room.findById(id).populate({ path: "users", select: '-password' })
        
        if (!room) {
            return res.status(404).json({error: 'No such room'})
        }

        const sanitizedRoom = senetizeRoom(room);
        res.status(200).json(sanitizedRoom)

    } catch (error) {
        console.log("Error in getRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const createRoom = async (req, res) => {
    try {
        const {name, password} =  req.body
        if(!name){
            return res.status(400).json({error:"No room name"})
        }

        let hashedPassword = null;
        let hasPassword = false;
        if(password && password.length > 0){
            hasPassword = true;

            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(password, salt)
        }
        const room = await Room.create({
            name,
            owner: req.user._id,
            chat: null,
            users: [],
            gameId: null,
            hasPassword,
            password: hashedPassword
        })
        room.populate({ path: "users", select: '-password' });

        const sanitizedRoom = senetizeRoom(room);
        //SOCKET IO
        io.emit("newRoom", sanitizedRoom);

        res.status(200).json(sanitizedRoom)
    } catch (error) {
        console.log("Error in createRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const joinRoom = async (req,res) => {
    try {
        const loggedInUserId = req.user._id
        const roomId = req.body.roomId
        const password = req.body.password

        let room = await Room.findById({_id: roomId}).populate({ path: "users", select: '-password' });
        if(!room){
            return res.status(400).json({error:"No room found with such id"})
        }
        
        if(room.hasPassword){
            const isPasswordCorrect = await bcrypt.compare(password, room?.password || "")
            if(!isPasswordCorrect){
                return res.status(400).json({error:"Invalid password"})
            }
        }
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

        room = await Room.findOneAndUpdate(
            { _id: roomId },
            { $addToSet: { users: loggedInUserId } }, // $addToSet adds to array if not already present
            { new: true } // to return the updated room document
        ).populate({ path: "users", select: '-password' })

        const senitizedRoom = senetizeRoom(room);

        //SOCKET IO
        io.emit("updateRoom", senitizedRoom)
        res.status(200).json(senitizedRoom)

    } catch (error) {
        console.log("Error in joinRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const leaveRoom = async (req, res) => {
    try {
        console.log("Leaving room");
        const loggedInUserId = req.user._id;
        const roomId = req.params.id;

        // Fetch the room details first
        const room = await Room.findById(roomId).populate({ path: "users", select: '-password' });

        if (!room) {
            return res.status(400).json({ error: "No room found with such id" });
        }

        // Leave the game if it exists
        if (room.gameId) {
            console.log("Leaving game");
            await leaveCurrentGame(loggedInUserId);
        }

        // Update the room by removing the user
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $pull: { users: loggedInUserId } },
            { new: true } // to return the updated room document
        );

        if (!updatedRoom) {
            return res.status(400).json({ error: "Failed to update room" });
        }

        // Update the user status and roomId
        const usr = await User.findByIdAndUpdate(
            loggedInUserId,
            { roomId: null, status: 'online' },
            { new: true }
        );

        if (!usr) {
            return res.status(400).json({ error: "No user found with such id" });
        }

        // If the room is empty, delete it and its associated game
        updatedRoom.populate({ path: "users", select: '-password' });
        const senitizedRoom = senetizeRoom(updatedRoom);

        if (updatedRoom.users.length === 0) {
            await Room.findByIdAndDelete(roomId);
            io.emit("deleteRoom", senitizedRoom);

            if (updatedRoom.gameId) {
                await deleteGame(updatedRoom.gameId);
            }
        } else {
            io.emit("updateRoom", senitizedRoom);
        }

        res.status(200).json(senitizedRoom);
    } catch (error) {
        console.log("Error in leaveRoom: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const clearUsers = async (roomId) => {
    await User.updateMany(
        { roomId: roomId },
        { roomId: null, status: 'online'}
    )
}

export const deleteRoom = async (req,res) => {
    try {
        const roomId = req.params.id
        const room = await Room.findById(roomId).populate({ path: "users", select: '-password' })
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
        io.emit("deleteRoom", senetizeRoom(room))

        res.status(200).json(senetizeRoom(room))
    }catch (error) {
        console.log("Error in deleteRoom: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

const senetizeRoom = (room) => {
    return {
        _id: room._id,
        name: room.name,
        owner: room.owner,
        chat: room.chat,
        users: room.users,
        gameId: room.gameId,
        hasPassword: room.hasPassword // Only send hasPassword to the frontend
    }
}