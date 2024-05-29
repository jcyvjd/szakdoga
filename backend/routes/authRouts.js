import express from "express";
import {signup,login,logout, setReady} from "../controllers/authController.js"

const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.post("/ready/:id", setReady)


export default router;

