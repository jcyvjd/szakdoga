import express from "express"
import {getRooms, getRoom, createRoom, joinRoom, leaveRoom, deleteRoom} from "../controllers/roomController.js"
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/",protectRoute, getRooms)

router.get("/:id", protectRoute, getRoom)

router.post("/", protectRoute, createRoom)

router.post("/join/:id", protectRoute, joinRoom)

router.post("/leave/:id", protectRoute, leaveRoom)

router.delete("/delete/:id", protectRoute, deleteRoom)

export default router