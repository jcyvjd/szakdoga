import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser" 
import authRoutes from "./routes/authRouts.js"
import roomRoutes from "./routes/roomRoutes.js"

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js"

const PORT = process.env.PORT || 5000


dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/rooms",roomRoutes);


server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);
})



