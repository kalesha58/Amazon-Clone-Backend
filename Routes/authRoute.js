import express from "express";
const router = express.Router();
import { registerController,loginController, verfifyEmail } from "../Controllers/authController.js";
//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
//LOGIN || POST
router.post("/login", loginController);
router.get("/verify/:token",verfifyEmail)
export default router;
