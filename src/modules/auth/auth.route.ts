import { Router } from "express";
import { authController } from "./auth.controller";


const router=Router()
//sign up user
router.post("/signup",authController.registerUser)
//login user
router.post("/login",authController.loginUser)
export const authRoute=router